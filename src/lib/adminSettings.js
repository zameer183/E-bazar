"use client";

import { useEffect, useState } from "react";

const SETTINGS_KEY = "eBazarAdminSettings";

export const DEFAULT_ADMIN_SETTINGS = {
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  },
  firestore: {
    shopsCollection: "shops",
    imagesCollection: "shopImages",
    videosCollection: "shopVideos",
    productImagesCollection: "productImages",
  },
  aws: {
    bucket: "",
    region: "",
    basePath: "",
  },
};

const mergeWithDefaults = (settings) => {
  if (!settings || typeof settings !== "object") {
    return DEFAULT_ADMIN_SETTINGS;
  }
  return {
    firebase: { ...DEFAULT_ADMIN_SETTINGS.firebase, ...(settings.firebase || {}) },
    firestore: { ...DEFAULT_ADMIN_SETTINGS.firestore, ...(settings.firestore || {}) },
    aws: { ...DEFAULT_ADMIN_SETTINGS.aws, ...(settings.aws || {}) },
  };
};

export const readAdminSettings = () => {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_SETTINGS;
  }
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return DEFAULT_ADMIN_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return mergeWithDefaults(parsed);
  } catch (error) {
    console.warn("Unable to read admin settings", error);
    return DEFAULT_ADMIN_SETTINGS;
  }
};

export const writeAdminSettings = (settings) => {
  if (typeof window === "undefined") {
    return;
  }
  const payload = mergeWithDefaults(settings);
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
  window.dispatchEvent(
    new CustomEvent("ebazar:settings-updated", { detail: { key: SETTINGS_KEY } }),
  );
};

export const useAdminSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_ADMIN_SETTINGS);

  useEffect(() => {
    const sync = () => {
      setSettings(readAdminSettings());
    };

    sync();

    const handleStorage = (event) => {
      if (event.key === SETTINGS_KEY || event.key === null) {
        sync();
      }
    };

    const handleCustom = (event) => {
      if (!event.detail || event.detail.key === SETTINGS_KEY) {
        sync();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("ebazar:settings-updated", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("ebazar:settings-updated", handleCustom);
    };
  }, []);

  return settings;
};
