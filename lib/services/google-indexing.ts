import { google } from "googleapis";

const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.travelpath.io.vn";

type NotifyType = "URL_UPDATED" | "URL_DELETED";

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

function parseServiceAccountCredentials(): ServiceAccountCredentials | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccountCredentials>;
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error(
        "Service account JSON is missing client_email or private_key",
      );
    }

    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    };
  } catch (error) {
    console.error(
      "[Indexing API] Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:",
      error,
    );
    return null;
  }
}

function buildBlogUrl(slug: string) {
  const normalizedSlug = slug.replace(/^\/+/, "");
  return `${SITE_URL}/blog/${normalizedSlug}`;
}

async function notifyGoogle(url: string, type: NotifyType) {
  const credentials = parseServiceAccountCredentials();
  if (!credentials) {
    // Allow app logic to continue even if Indexing API is not configured.
    return;
  }

  try {
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [INDEXING_SCOPE],
    });

    const indexing = google.indexing({ version: "v3", auth });
    await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type,
      },
    });
  } catch (error) {
    // Indexing failures should not block publishing/unpublishing flows.
    console.error(
      `[Indexing API] Failed to notify Google for ${url} (${type}):`,
      error,
    );
  }
}

export async function notifyBlogUrlUpdated(slug: string) {
  const url = buildBlogUrl(slug);
  await notifyGoogle(url, "URL_UPDATED");
}

export async function notifyBlogUrlDeleted(slug: string) {
  const url = buildBlogUrl(slug);
  await notifyGoogle(url, "URL_DELETED");
}
