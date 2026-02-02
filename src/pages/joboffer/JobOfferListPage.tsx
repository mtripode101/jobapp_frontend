// src/pages/joboffer/JobOfferListPage.tsx
import React, { useEffect, useState } from "react";
import { jobOfferService } from "../../services/jobOfferService";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobOfferDto } from "../../types/jobOfferDto";
import { JobApplicationDto } from "../../types/jobApplicationDto";
import { Link } from "react-router-dom";

export default function JobOfferListPage() {
  const [offers, setOffers] = useState<JobOfferDto[]>([]);
  const [applicationsMap, setApplicationsMap] = useState<Record<number, JobApplicationDto>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const normalizeOffersAndApps = (rawOffers: any, rawApps: any) => {
    const offersArray: any[] = Array.isArray(rawOffers)
      ? rawOffers
      : Array.isArray(rawOffers?.data)
      ? rawOffers.data
      : Array.isArray(rawOffers?.content)
      ? rawOffers.content
      : Array.isArray(rawOffers?.items)
      ? rawOffers.items
      : [];

    const appsArray: any[] = Array.isArray(rawApps)
      ? rawApps
      : Array.isArray(rawApps?.data)
      ? rawApps.data
      : [];

    const map: Record<number, JobApplicationDto> = {};
    appsArray.forEach((a: any) => {
      if (a?.id != null) map[a.id] = a;
    });

    let offersFromApps: any[] = [];
    if (offersArray.length === 0 && appsArray.length > 0) {
      appsArray.forEach((a: any) => {
        if (Array.isArray(a.offers) && a.offers.length > 0) {
          a.offers.forEach((of: any) => {
            if (!of.applicationId && a.id) of.applicationId = a.id;
            of.application = of.application ?? a;
            offersFromApps.push(of);
          });
        }
      });
    }

    const finalOffersArray = offersArray.length ? offersArray : offersFromApps;

    const normalizedOffers: JobOfferDto[] = finalOffersArray.map((o: any) => {
      const applicationObj = o?.application ?? null;
      const applicationId = applicationObj?.id ?? o?.applicationId ?? null;

      if (applicationObj?.id != null) {
        map[applicationObj.id] = applicationObj;
      }

      return {
        id: o.id,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        offeredAt: o.offeredAt,
        status: o.status,
        applicationId: applicationId,
        application: applicationObj ?? undefined,
        expectedSalary: o.expectedSalary ?? null,
        offeredSalary: o.offeredSalary ?? null,
      } as JobOfferDto;
    });

    return { normalizedOffers, applicationsMap: map };
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([jobOfferService.getAll(), jobApplicationService.getAll()])
      .then(([offersData, appsData]) => {
        if (!mounted) return;
        const { normalizedOffers, applicationsMap: mergedMap } = normalizeOffersAndApps(offersData, appsData);
        setOffers(normalizedOffers);
        setApplicationsMap(mergedMap);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load job offers or applications");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const refresh = () => {
    setLoading(true);
    setError(null);
    Promise.all([jobOfferService.getAll(), jobApplicationService.getAll()])
      .then(([offersData, appsData]) => {
        const { normalizedOffers, applicationsMap: mergedMap } = normalizeOffersAndApps(offersData, appsData);
        setOffers(normalizedOffers);
        setApplicationsMap(mergedMap);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to refresh data");
      })
      .finally(() => setLoading(false));
  };

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "—";
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString();
    } catch {
      return isoDate;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this job offer permanently")) return;
    setProcessingId(id);
    try {
      await jobOfferService.delete(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete offer");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAccept = async (id: number) => {
    setProcessingId(id);
    try {
      await jobOfferService.accept(id);
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: "ACCEPTED" } : o)));
    } catch (err) {
      console.error(err);
      setError("Failed to accept offer");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      await jobOfferService.reject(id);
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: "REJECTED" } : o)));
    } catch (err) {
      console.error(err);
      setError("Failed to reject offer");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <h2>Job Offers</h2>

      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/job-offers/new">➕ Create Offer</Link>

      {loading && <p>Loading job offers...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && offers.length === 0 && <p>No job offers found</p>}

      {!loading && offers.length > 0 && (
        <table border={1} style={{ width: "100%", marginTop: 20 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Candidate</th>
              <th>Company</th>
              <th>Position</th>
              <th>Offered At</th>
              <th>Expected Salary</th>
              <th>Offered Salary</th>
              <th>Offer Status</th>
              <th style={{ minWidth: 220 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => {
              const app = offer.applicationId ? applicationsMap[offer.applicationId] : undefined;
              return (
                <tr key={offer.id}>
                  <td>{offer.id}</td>
                  <td>
                    {app?.candidate?.fullName ? (
                      <Link to={`/applications/${app.id}`}>{app.candidate.fullName}</Link>
                    ) : (
                      app ? "—" : <span>Application #{offer.applicationId}</span>
                    )}
                  </td>
                  <td>{app?.company?.name ?? "—"}</td>
                  <td>{app?.position?.title ?? "—"}</td>
                  <td>{formatDate(offer.offeredAt)}</td>
                  <td>{offer.expectedSalary != null ? `$${offer.expectedSalary}` : "—"}</td>
                  <td>{offer.offeredSalary != null ? `$${offer.offeredSalary}` : "—"}</td>
                  <td>{offer.status ?? "—"}</td>
                  <td>
                    <Link to={`/job-offers/${offer.id}`} style={{ marginRight: 8 }}>
                      🔍 Detail
                    </Link>
                    <Link to={`/job-offers/${offer.id}/edit`} style={{ marginRight: 8 }}>
                      ✏️ Edit
                    </Link>
                    {offer.status !== "ACCEPTED" && (
                      <button
                        onClick={() => offer.id && handleAccept(offer.id)}
                        disabled={processingId === offer.id}
                        style={{ marginRight: 8 }}
                      >
                        {processingId === offer.id ? "Processing..." : "Accept"}
                      </button>
                    )}
                    {offer.status !== "REJECTED" && (
                      <button
                        onClick={() => offer.id && handleReject(offer.id)}
                        disabled={processingId === offer.id}
                        style={{ marginRight: 8 }}
                      >
                        {processingId === offer.id ? "Processing..." : "Reject"}
                      </button>
                    )}
                    <button
                      onClick={() => offer.id && handleDelete(offer.id)}
                      disabled={processingId === offer.id}
                    >
                      {processingId === offer.id ? "Processing..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={refresh} disabled={loading}>
          Refresh
        </button>
      </div>
    </div>
  );
}