const FALLBACK_IMAGE = "/images/placeholder-image.svg";
const MEDIA_PROXY_ENDPOINT = "/api/media/public";

const isAbsoluteUrl = (url) => /^https?:\/\//i.test(url);

const parseHostname = (url) => {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    try {
      return new URL(url, "https://placeholder.invalid").hostname;
    } catch {
      return null;
    }
  }
};

const shouldProxyViaBackend = (hostname) => {
  if (!hostname) return false;
  if (hostname.endsWith(".s3.amazonaws.com")) return true;
  return /\.s3[.-][^.]+\.amazonaws\.com$/i.test(hostname);
};

const shouldBypassOptimizer = (hostname) => {
  if (!hostname) return false;
  if (hostname === "firebasestorage.googleapis.com") return true;
  return shouldProxyViaBackend(hostname);
};

export const buildImageProps = (rawSrc, fallback = FALLBACK_IMAGE) => {
  const src =
    typeof rawSrc === "string" && rawSrc.trim().length > 0
      ? rawSrc.trim()
      : fallback;

  const hostname = parseHostname(src);
  const shouldProxy = isAbsoluteUrl(src) && shouldProxyViaBackend(hostname);
  const finalSrc = shouldProxy ? `${MEDIA_PROXY_ENDPOINT}?url=${encodeURIComponent(src)}` : src;
  const props = { src: finalSrc };

  if (shouldProxy) {
    props.unoptimized = true;
  } else if (isAbsoluteUrl(src) && shouldBypassOptimizer(hostname)) {
    props.unoptimized = true;
  }

  if (src === fallback) {
    props.priority = false;
  }

  return props;
};

export default buildImageProps;
