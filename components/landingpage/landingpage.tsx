import React from "react";
import "./style.css";
import { Box, Button, Link, Stack, Typography } from "@mui/material";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Stack
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        sx={{width: {xs: "90%", sm: "88%", md: "84%", lg: "80%"}}}
      >
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "light",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 2,
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Logo
        </Typography>
        <Link href="/waitlist">
          <Button
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "transparent",
              border: "2px solid transparent",
              transition: "all 0.3s ease",
              borderRadius: "8px",
              fontSize: { xs: 12, sm: 16, md: 18, lg: 20, xl: 22 },
              textWrap: "nowrap",

              "@media (hover: hover)": {
                "&:hover": {
                  backgroundColor: "white   ",
                  transform: "scale(1.05)",
                  color: "black",
                  borderColor: "white",
                },
              },
            }}
          >
            Start Using Caskayd
          </Button>
        </Link>
      </Stack>
      <div className="background">
        <Box
          sx={{
            gap: {
              xs: 4,
              sm: 8,
              md: 15,
              lg: 20,
            },
            paddingBottom: "50px",
          }}
        >
          <Stack
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "10px",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 20, sm: 30, md: 42, lg: 50},
                color: "white",
                fontWeight: "bold",
                letterSpacing: 2,
                /* textTransform: "uppercase", */
                marginBottom: 2,
                fontFamily: "Roboto, sans-serif",
                paddingLeft: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
                paddingRight: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
                mb: 4,
              }}
            >
              Your Partner For Strategic Influencer Marketing
            </Typography>
            <Typography
              sx={{
                color: "white",
                fontWeight: "light",
                letterSpacing: 2,
                /* textTransform: "uppercase", */
                marginBottom: 2,
                fontFamily: "Roboto, sans-serif",
                paddingLeft: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
                paddingRight: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
                fontSize: { xs: 16, sm: 16, md: 18, lg: 20, xl: 22 },
                mb: 8,
              }}
            >
              Whether you&apos;re a business looking to expand your reach or a creator seeking impactful collaborations. Caskayd provides the intuitive tools and resources to make it happen
            </Typography>
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                letterSpacing: 2,
                /* textTransform: "uppercase", */
                marginBottom: 6,
                fontFamily: "Roboto, sans-serif",
                fontSize: { xs: 16, sm: 20, md: 25, lg: 28, xl: 30 },
              }}
            >
              Quick one! Where do you belong?
            </Typography>
            <Stack
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 10,
              }}
              sx={{
                gap: {
                  xs: 4,
                  sm: 8,
                  md: 15,
                  lg: 20,
                },
              }}
            >
              <Link href="/creator">
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      //backgroundColor: "#f0f0f0",
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  Creator
                </Button>
              </Link>
              <Link href="/business">
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      backgroundColor: "#111",
                    },
                  }}
                >
                  Business
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </div>
    </div>
  );
}
