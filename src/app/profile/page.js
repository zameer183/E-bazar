"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const PROFILE_FIELD_IDS = {
  name: "profile-full-name",
  email: "profile-email",
  phone: "profile-phone",
  bio: "profile-bio",
  currentPassword: "profile-current-password",
  newPassword: "profile-new-password",
  confirmPassword: "profile-confirm-password",
  emailNotifications: "profile-email-notifications",
  marketingEmails: "profile-marketing-emails",
  profileVisibility: "profile-visibility",
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    image: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    profileVisibility: "public",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  useEffect(() => {
    const initializeProfile = async () => {
      if (typeof window !== "undefined") {
        const { onAuthChange } = await import("@/lib/auth");

        // Listen to auth state
        onAuthChange(async (user) => {
          if (!user) {
            router.push("/login");
            return;
          }

          // Load user profile from Firestore
          const { getUserProfile } = await import("@/lib/firestore");
          const result = await getUserProfile(user.uid);

          if (result.success) {
            const profile = result.data;
            setUserProfile(profile);
            setFormData({
              name: profile.name || "",
              email: profile.email || user.email || "",
              phone: profile.phone || "",
              bio: profile.bio || "",
            });
          } else {
            // Set default values from auth
            setFormData({
              name: "",
              email: user.email || "",
              phone: "",
              bio: "",
            });
          }

          // Load settings from Firestore
          const { getUserSettings } = await import("@/lib/firestore");
          const settingsResult = await getUserSettings(user.uid);

          if (settingsResult.success) {
            setSettings(settingsResult.data);
          }

          setLoading(false);
        });
      }
    };

    initializeProfile();
  }, [router]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProfile = {
          ...userProfile,
          image: reader.result,
          imageName: file.name,
        };
        setUserProfile(updatedProfile);
        window.localStorage.setItem("eBazarUserProfile", JSON.stringify(updatedProfile));
        showNotification("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    if (!formData.name || !formData.email) {
      showNotification("Name and email are required!", "error");
      return;
    }

    try {
      // Get current user
      const { getCurrentUser } = await import("@/lib/auth");
      const currentUser = getCurrentUser();

      if (!currentUser) {
        showNotification("Please log in again", "error");
        router.push("/login");
        return;
      }

      const updatedProfile = {
        ...formData,
        imageUrl: userProfile.imageUrl || null,
      };

      // Save to Firestore
      const { setUserProfile } = await import("@/lib/firestore");
      const result = await setUserProfile(currentUser.uid, updatedProfile);

      if (!result.success) {
        showNotification("Failed to update profile", "error");
        return;
      }

      setUserProfile(updatedProfile);
      setIsEditingProfile(false);
      showNotification("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      showNotification("Failed to update profile", "error");
    }
  };

  const handlePasswordSave = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showNotification("All password fields are required!", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("New passwords do not match!", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showNotification("Password must be at least 6 characters long!", "error");
      return;
    }

    try {
      // Use Firebase Auth to change password
      const { changeUserPassword } = await import("@/lib/auth");
      const result = await changeUserPassword(passwordData.currentPassword, passwordData.newPassword);

      if (!result.success) {
        showNotification(result.error, "error");
        return;
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      showNotification("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      showNotification("Failed to change password", "error");
    }
  };

  const handleSettingsSave = async () => {
    try {
      // Get current user
      const { getCurrentUser } = await import("@/lib/auth");
      const currentUser = getCurrentUser();

      if (!currentUser) {
        showNotification("Please log in again", "error");
        return;
      }

      // Save to Firestore
      const { saveUserSettings } = await import("@/lib/firestore");
      const result = await saveUserSettings(currentUser.uid, settings);

      if (!result.success) {
        showNotification("Failed to save settings", "error");
        return;
      }

      showNotification("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      showNotification("Failed to save settings", "error");
    }
  };

  const handleDeleteProfilePicture = () => {
    const updatedProfile = {
      ...userProfile,
      image: null,
      imageName: null,
    };
    setUserProfile(updatedProfile);
    window.localStorage.setItem("eBazarUserProfile", JSON.stringify(updatedProfile));
    showNotification("Profile picture removed successfully!");
  };

  const handleDeleteAccount = async () => {
    if (typeof window !== "undefined") {
      try {
        // Delete from Firebase
        const { getCurrentUser, signOutUser } = await import("@/lib/auth");
        const { deleteShop, getShopsByOwner } = await import("@/lib/firestore");

        const currentUser = getCurrentUser();
        if (!currentUser) {
          showNotification("Please log in again", "error");
          return;
        }

        // Delete all user's shops
        const shopsResult = await getShopsByOwner(currentUser.uid);
        if (shopsResult.success && shopsResult.data.length > 0) {
          for (const shop of shopsResult.data) {
            await deleteShop(shop.id);
          }
        }

        // Clear localStorage
        window.localStorage.removeItem("eBazarLoggedIn");
        window.localStorage.removeItem("eBazarCurrentUser");
        window.localStorage.removeItem("eBazarUserProfile");
        window.localStorage.removeItem("eBazarUserSettings");
        window.localStorage.removeItem("markets");

        // Sign out and close modal
        await signOutUser();
        setShowDeleteAccountModal(false);

        // Redirect to home
        router.push("/");
      } catch (error) {
        console.error("Error deleting account:", error);
        showNotification("Failed to delete account", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Notification Toast */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <span className={styles.notificationIcon}>
            {notification.type === "success"
              ? "Success"
              : notification.type === "error"
              ? "Error"
              : notification.type === "warning"
              ? "Warning"
              : "Info"}
          </span>
          <span className={styles.notificationMessage}>{notification.message}</span>
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        {/* Profile Picture Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Profile Picture</h2>
          </div>
          <div className={styles.profilePictureContainer}>
            <div className={styles.profilePictureWrapper}>
              <div className={styles.profilePlaceholder}>
                {userProfile.image ? (
                  <Image
                    src={userProfile.image}
                    alt="Profile"
                    fill
                    className={styles.profilePicture}
                    sizes="150px"
                    unoptimized
                  />
                ) : (
                  <span>
                    {(userProfile.name || formData.email || "User").slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.profilePictureActions}>
              <label className={styles.uploadButton}>
                {userProfile.image ? "Change Picture" : "Upload Picture"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  name="profile-image-settings"
                  id="profile-image-settings"
                  style={{ display: "none" }}
                />
              </label>
              {userProfile.image && (
                <button onClick={handleDeleteProfilePicture} className={styles.deleteButton}>
                  Remove Picture
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Profile Information</h2>
            {!isEditingProfile ? (
              <button onClick={() => setIsEditingProfile(true)} className={styles.editButton}>
                Edit
              </button>
            ) : (
              <div className={styles.editActions}>
                <button onClick={handleProfileSave} className={styles.saveButton}>
                  Save
                </button>
                <button onClick={() => {
                  setIsEditingProfile(false);
                  setFormData({
                    name: userProfile.name || "",
                    email: userProfile.email || "",
                    phone: userProfile.phone || "",
                    bio: userProfile.bio || "",
                  });
                }} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              {isEditingProfile ? (
                <>
                  <label htmlFor={PROFILE_FIELD_IDS.name}>Full Name</label>
                  <input
                    id={PROFILE_FIELD_IDS.name}
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    className={styles.input}
                    placeholder="Enter your full name"
                  />
                </>
              ) : (
                <>
                  <span className={styles.infoLabel}>Full Name</span>
                  <span>{formData.name || "Not set"}</span>
                </>
              )}
            </div>
            <div className={styles.infoRow}>
              {isEditingProfile ? (
                <>
                  <label htmlFor={PROFILE_FIELD_IDS.email}>Email Address</label>
                  <input
                    id={PROFILE_FIELD_IDS.email}
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className={styles.input}
                    placeholder="Enter your email"
                  />
                </>
              ) : (
                <>
                  <span className={styles.infoLabel}>Email Address</span>
                  <span>{formData.email || "Not set"}</span>
                </>
              )}
            </div>
            <div className={styles.infoRow}>
              {isEditingProfile ? (
                <>
                  <label htmlFor={PROFILE_FIELD_IDS.phone}>Phone Number</label>
                  <input
                    id={PROFILE_FIELD_IDS.phone}
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className={styles.input}
                    placeholder="Enter your phone number"
                  />
                </>
              ) : (
                <>
                  <span className={styles.infoLabel}>Phone Number</span>
                  <span>{formData.phone || "Not set"}</span>
                </>
              )}
            </div>
            <div className={styles.infoRow}>
              {isEditingProfile ? (
                <>
                  <label htmlFor={PROFILE_FIELD_IDS.bio}>Bio</label>
                  <textarea
                    id={PROFILE_FIELD_IDS.bio}
                    name="bio"
                    autoComplete="off"
                    value={formData.bio}
                    onChange={handleProfileChange}
                    className={styles.textarea}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </>
              ) : (
                <>
                  <span className={styles.infoLabel}>Bio</span>
                  <span>{formData.bio || "Not set"}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Change Password</h2>
            {!isChangingPassword && (
              <button onClick={() => setIsChangingPassword(true)} className={styles.editButton}>
                Change Password
              </button>
            )}
          </div>
          {isChangingPassword ? (
            <div className={styles.profileInfo}>
              <div className={styles.infoRow}>
                <label htmlFor={PROFILE_FIELD_IDS.currentPassword}>Current Password</label>
                <input
                  id={PROFILE_FIELD_IDS.currentPassword}
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={styles.input}
                  placeholder="Enter current password"
                />
              </div>
              <div className={styles.infoRow}>
                <label htmlFor={PROFILE_FIELD_IDS.newPassword}>New Password</label>
                <input
                  id={PROFILE_FIELD_IDS.newPassword}
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={styles.input}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
              <div className={styles.infoRow}>
                <label htmlFor={PROFILE_FIELD_IDS.confirmPassword}>Confirm New Password</label>
                <input
                  id={PROFILE_FIELD_IDS.confirmPassword}
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={styles.input}
                  placeholder="Confirm new password"
                />
              </div>
              <div className={styles.editActions}>
                <button onClick={handlePasswordSave} className={styles.saveButton}>
                  Save Password
                </button>
                <button onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className={styles.helpText}>Click &quot;Change Password&quot; to update your password</p>
          )}
        </div>

        {/* Settings Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Account Settings</h2>
          </div>
          <div className={styles.settingsInfo}>
            <div className={styles.settingRow}>
              <div className={styles.settingLabel}>
                <label htmlFor={PROFILE_FIELD_IDS.emailNotifications}>Email Notifications</label>
                <span className={styles.settingDescription}>
                  Receive email notifications about your shop activity
                </span>
              </div>
              <div className={styles.switchWrapper}>
                <input
                  id={PROFILE_FIELD_IDS.emailNotifications}
                  className={styles.switchInput}
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleSettingsChange}
                />
                <label className={styles.switch} htmlFor={PROFILE_FIELD_IDS.emailNotifications}>
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
            <div className={styles.settingRow}>
              <div className={styles.settingLabel}>
                <label htmlFor={PROFILE_FIELD_IDS.marketingEmails}>Marketing Emails</label>
                <span className={styles.settingDescription}>
                  Receive promotional emails and special offers
                </span>
              </div>
              <div className={styles.switchWrapper}>
                <input
                  id={PROFILE_FIELD_IDS.marketingEmails}
                  className={styles.switchInput}
                  type="checkbox"
                  name="marketingEmails"
                  checked={settings.marketingEmails}
                  onChange={handleSettingsChange}
                />
                <label className={styles.switch} htmlFor={PROFILE_FIELD_IDS.marketingEmails}>
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
            <div className={styles.settingRow}>
              <div className={styles.settingLabel}>
                <label htmlFor={PROFILE_FIELD_IDS.profileVisibility}>Profile Visibility</label>
                <span className={styles.settingDescription}>
                  Control who can see your profile information
                </span>
              </div>
              <select
                id={PROFILE_FIELD_IDS.profileVisibility}
                name="profileVisibility"
                autoComplete="off"
                value={settings.profileVisibility}
                onChange={handleSettingsChange}
                className={styles.select}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </div>
          <button onClick={handleSettingsSave} className={styles.saveButton}>
            Save Settings
          </button>
        </div>

        {/* Danger Zone - Delete Account */}
        <div className={styles.section}>
          <div className={styles.dangerZone}>
            <h2>Danger Zone</h2>
            <p>
              Once you delete your account, there is no going back. This will permanently delete
              your profile, all shops, images, and data associated with your account.
            </p>
            <button
              onClick={() => setShowDeleteAccountModal(true)}
              className={styles.deleteAccountButton}
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 style={{ color: '#c53030' }}>Delete Account</h2>
            <p>
              Are you sure you want to delete your account? This will permanently delete all your
              data including shops, images, and profile information. This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleDeleteAccount} className={styles.confirmDeleteButton}>
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
