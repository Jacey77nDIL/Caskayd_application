import React from "react";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faGooglePlay,
  faInstagram,
  faFacebookF,
  faTiktok,
  faYoutube,
  faXTwitter,
  faWhatsapp,
  faSnapchatGhost,
  faTelegramPlane,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

export default function ContentCreator() {
  return (
    <Box sx={styles.landingPage}>
      {/* Navbar Stack with Glassmorphism */}
      <Stack sx={styles.navbar}>
        <Typography variant="h5" sx={styles.logoText}>
          Caskayd
        </Typography>

        <Link href="/WebCreatorSignUp" underline="none">
          <Button
            component={Link}
            href="/WebCreatorSignUp"
            variant="outlined"
            sx={styles.navButton}
          >
            Start Using Caskayd
          </Button>
        </Link>
      </Stack>

      {/* SECTION 1: Hero - Turn Content Into Income */}
      <Box sx={styles.backgroundCard}>
        <Box>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "20px",
              paddingX: "10px",
              position: "relative",
              overflowY: "hidden",
            }}
          >
            <Typography sx={styles.heroHeading}>
              Turn Your Content Into Income
            </Typography>
            <Typography sx={styles.heroSubtext}>
              Ready to monetize your passion? Our platform empowers creators
              like you to effortlessly transform your valuable content into a
              steady revenue stream.
            </Typography>

            {/* Store Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 3, sm: 4, md: 6 },
                marginTop: 4,
              }}
            >
              <Link href="#" underline="none">
                <Button variant="contained" sx={styles.storeButtonWhite}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={styles.iconBox}>
                      <FontAwesomeIcon icon={faGooglePlay} />
                    </Box>
                    <Stack textAlign="left">
                      <Typography sx={styles.storeSmallText}>
                        Get it on
                      </Typography>
                      <Typography sx={styles.storeLargeText}>
                        Google Play
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              </Link>
              <Link href="#" underline="none">
                <Button variant="contained" sx={styles.storeButtonBlack}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={styles.iconBox}>
                      <FontAwesomeIcon icon={faApple} />
                    </Box>
                    <Stack textAlign="left">
                      <Typography sx={styles.storeSmallText}>
                        Download on the
                      </Typography>
                      <Typography sx={styles.storeLargeText}>
                        App Store
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Box>

        {/* Hero Image Container */}
        <Stack sx={styles.imageContainer}>
          <Image
            src="/images/ecommerce.jpeg"
            alt="ec"
            fill
            style={{ objectFit: "cover", borderRadius: 10 }}
          />
        </Stack>
      </Box>

      {/* SECTION 2: Platform Links */}
      <Typography sx={styles.sectionTitle}>
        Advertise with any of your platforms
      </Typography>

      {/* Social Icons Strip 1 */}
      <Stack sx={styles.socialStrip}>
        {[faInstagram, faFacebookF, faTiktok, faYoutube].map((icon, index) => (
          <Box key={index} sx={styles.socialIconBox}>
            <FontAwesomeIcon icon={icon} />
          </Box>
        ))}
      </Stack>

      {/* Social Icons Strip 2 */}
      <Stack sx={{ ...styles.socialStrip, marginBottom: { xs: 6, md: 10 } }}>
        {[faXTwitter, faWhatsapp, faSnapchatGhost, faTelegramPlane].map(
          (icon, index) => (
            <Box key={index} sx={styles.socialIconBox}>
              <FontAwesomeIcon icon={icon} />
            </Box>
          )
        )}
      </Stack>

      {/* SECTION 3: Earn From Every Post */}
      <Typography sx={styles.sectionHeading}>
        Earn From Every Post
      </Typography>
      <Typography sx={styles.sectionSubtext}>
        Join campaigns and get paid to promote what you love.
      </Typography>

      <Box sx={styles.earnCard}>
        <Stack sx={styles.imageContainer}>
          <Image
            src="/images/EarnFromEveryPost.png"
            alt="earn"
            fill
            style={{ objectFit: "cover", borderRadius: 10 }}
          />
        </Stack>
      </Box>

      {/* SECTION 4: Skip The Gatekeepers */}
      <Typography sx={styles.sectionHeading}>
        Skip The Gatekeepers
      </Typography>
      <Typography sx={styles.sectionSubtext}>
        No managers. No middlemen. Just direct deals and clear payments.
      </Typography>

      <Box sx={styles.skipCard}>
        <Stack sx={styles.imageContainer}>
          <Image
            src="/images/SkipTheGateKeepers.png"
            alt="skip"
            fill
            style={{ objectFit: "cover", borderRadius: 10 }}
          />
        </Stack>
      </Box>

      {/* CTA Footer */}
      <Stack sx={{ width: "100%", textAlign: "left", marginBottom: 4 }}>
        <Typography sx={styles.heroHeading}>Try Caskayd Now</Typography>
      </Stack>

      <Stack sx={styles.footerContainer}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          spacing={4}
        >
          {/* Footer Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            width={{ xs: "100%", md: "auto" }}
            justifyContent="center"
          >
            <Link href="#" underline="none">
              <Button variant="contained" sx={styles.storeButtonWhite}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={styles.iconBox}>
                    <FontAwesomeIcon icon={faGooglePlay} />
                  </Box>
                  <Stack textAlign="left">
                    <Typography sx={styles.storeSmallText}>Get it on</Typography>
                    <Typography sx={styles.storeLargeText}>
                      Google Play
                    </Typography>
                  </Stack>
                </Stack>
              </Button>
            </Link>
            <Link href="#" underline="none">
              <Button variant="contained" sx={styles.storeButtonBlack}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={styles.iconBox}>
                    <FontAwesomeIcon icon={faApple} />
                  </Box>
                  <Stack textAlign="left">
                    <Typography sx={styles.storeSmallText}>
                      Download on the
                    </Typography>
                    <Typography sx={styles.storeLargeText}>
                      App Store
                    </Typography>
                  </Stack>
                </Stack>
              </Button>
            </Link>
          </Stack>

          {/* Footer Logo */}
          <Typography variant="h5" sx={styles.logoText}>
            Caskayd
          </Typography>
        </Stack>
      </Stack>

      {/* Footer Social Links */}
      <Stack alignItems="center" mb={6} width="100%">
        <Typography sx={styles.followUsText}>Follow us on</Typography>
        <Stack direction="row" spacing={4} mt={2}>
          {[faXTwitter, faFacebookF, faLinkedin, faInstagram].map((icon, index) => (
            <Link key={index} href="#" sx={styles.socialLinkFooter}>
              <FontAwesomeIcon icon={icon} />
            </Link>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

// ============================================
// IMPROVED STYLES OBJECT
// ============================================

const commonCardStyles = {
  // Linear gradient overlay ensures text readability over images
  backgroundImage:
    'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%), url("/images/landing.jpeg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "90%",
  maxWidth: "1400px",
  position: "relative",
  borderRadius: "30px",
  padding: { xs: "20px", md: "40px" },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  overflow: "hidden",
};

const styles = {
  landingPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#050505", // Slightly softer black
    paddingTop: "140px",
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",
  },
  // Glassmorphism Navbar
  navbar: {
    position: "fixed",
    top: 20,
    width: { xs: "95%", sm: "90%", md: "85%", lg: "80%" },
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    backgroundColor: "rgba(20, 20, 20, 0.6)",
    backdropFilter: "blur(16px)",
    borderRadius: "24px",
    padding: "12px 24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  },
  logoText: {
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: "Roboto, sans-serif",
    background: "linear-gradient(to right, #846120, #9D2424, #8D077B)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
    cursor: "default",
  },
  navButton: {
    color: "white",
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: "12px",
    textTransform: "none",
    fontSize: { xs: 12, sm: 14, md: 16 },
    padding: "8px 20px",
    "&:hover": {
      borderColor: "white",
      backgroundColor: "rgba(255,255,255,0.05)",
      boxShadow: "0 0 15px rgba(255,255,255,0.1)",
    },
  },

  // Card Styles
  backgroundCard: {
    ...commonCardStyles,
    marginTop: { xs: "20px", md: "40px" },
    marginBottom: "60px",
  },
  earnCard: {
    ...commonCardStyles,
    marginTop: "20px",
    marginBottom: { xs: "80px", md: "140px" },
  },
  skipCard: {
    ...commonCardStyles,
    marginTop: "20px",
    marginBottom: { xs: "80px", md: "140px" },
  },

  // Image Containers within cards
  imageContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "900px",
    aspectRatio: { xs: "16/9", md: "21/9" },
    height: { xs: "200px", sm: "300px", md: "400px", lg: "500px" },
    marginTop: { xs: 4, md: 8 },
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    borderRadius: "16px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.01)", // Subtle zoom interaction
    },
  },

  // Typography Styles
  heroHeading: {
    fontSize: { xs: 28, sm: 40, md: 55, lg: 70 },
    color: "white",
    fontWeight: "800",
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    fontFamily: "Roboto, sans-serif",
    maxWidth: "900px",
    margin: "0 auto 16px auto",
    textShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  heroSubtext: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "400",
    lineHeight: 1.6,
    fontFamily: "Roboto, sans-serif",
    fontSize: { xs: 16, sm: 18, md: 20 },
    maxWidth: "700px",
    margin: "0 auto 32px auto",
  },
  sectionTitle: {
    fontSize: { xs: 18, sm: 24, md: 32, lg: 40 },
    color: "white",
    fontWeight: "300",
    letterSpacing: 1,
    fontFamily: "Roboto, sans-serif",
    marginBottom: 4,
    opacity: 0.9,
  },
  sectionHeading: {
    fontSize: { xs: 24, sm: 32, md: 48, lg: 60 },
    color: "white",
    fontWeight: "700",
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
    marginBottom: 2,
    fontFamily: "Roboto, sans-serif",
    maxWidth: "1000px",
    paddingX: 2,
  },
  sectionSubtext: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "400",
    fontFamily: "Roboto, sans-serif",
    fontSize: { xs: 14, sm: 16, md: 20 },
    marginBottom: 6,
    paddingX: 2,
  },

  // Store Buttons
  storeButtonWhite: {
    backgroundColor: "white",
    color: "black",
    borderRadius: "14px",
    textTransform: "none",
    padding: "10px 24px",
    minWidth: "180px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-4px)",
      backgroundColor: "#f5f5f5",
      boxShadow: "0 10px 20px rgba(255,255,255,0.2)",
    },
  },
  storeButtonBlack: {
    backgroundColor: "black",
    color: "white",
    borderRadius: "14px",
    textTransform: "none",
    padding: "10px 24px",
    minWidth: "180px",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-4px)",
      backgroundColor: "#1a1a1a",
      borderColor: "white",
      boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
    },
  },
  storeSmallText: {
    fontSize: { xs: 10, md: 12 },
    textTransform: "uppercase",
    fontWeight: "500",
    opacity: 0.8,
    lineHeight: 1,
  },
  storeLargeText: {
    fontSize: { xs: 16, md: 20 },
    fontWeight: "bold",
    lineHeight: 1.2,
  },
  iconBox: {
    fontSize: { xs: 20, md: 28 },
    display: "flex",
    alignItems: "center",
  },

  // Social Icons
  socialStrip: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: { xs: 4, sm: 8, md: 10 },
    width: "100%",
    paddingX: 2,
    marginBottom: 4,
  },
  socialIconBox: {
    fontSize: { xs: 24, sm: 30, md: 40 },
    color: "rgba(255,255,255,0.6)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      color: "#fff",
      transform: "scale(1.2)",
      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))",
    },
  },

  // Footer
  footerContainer: {
    width: "90%",
    maxWidth: "1200px",
    marginBottom: 10,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: 6,
  },
  followUsText: {
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
  },
  socialLinkFooter: {
    color: "white",
    fontSize: 24,
    transition: "color 0.2s",
    "&:hover": {
      color: "#8D077B",
    },
  },
};