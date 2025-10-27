const FALLBACK_IMAGE = "/images/placeholder-image.svg";

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

const shouldBypassOptimizer = (hostname) => {
  if (!hostname) return false;
  if (hostname === "firebasestorage.googleapis.com") return true;
  return hostname.endsWith(".s3.amazonaws.com");
};

export const buildImageProps = (rawSrc, fallback = FALLBACK_IMAGE) => {
  const src =
    typeof rawSrc === "string" && rawSrc.trim().length > 0
      ? rawSrc.trim()
      : fallback;

  const hostname = parseHostname(src);
  const props = { src };

  if (isAbsoluteUrl(src) && shouldBypassOptimizer(hostname)) {
    props.unoptimized = true;
  }

  if (src === fallback) {
    props.priority = false;
  }

  return props;
};

export default buildImageProps;
