import React from "react";
import "./style.css";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGooglePlay,  faInstagram,  faFacebookF,  faTiktok,  faYoutube,  faXTwitter,  faWhatsapp,  faSnapchatGhost,  faTelegramPlane,} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

export default function ContentCreator() {
  return (
    <div className="landing-page">
      <Stack
        style={{
          position: "fixed",
          marginTop: "2rem",
          padding: "1rem",
          top: 0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
          backgroundColor: "black",
          borderRadius: 20,
          overflowY: "hidden",
        }}
        sx={{ width: { xs: "90%", sm: "88%", md: "84%", lg: "80%" } }}
      >
        <Typography
  variant="h5"
  sx={{
    fontWeight: "light",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "Roboto, sans-serif",
    paddingLeft: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
    background: "linear-gradient(to right, #846120, #9D2424, #8D077B)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text", // for non-webkit browsers
    color: "transparent", // fallback
  }}
>
  Caskayd
</Typography>

        <Link href="/WebBusinessSignUp">
          <Button
            component={Link}
            href="/WebBusinessSignUp"
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
        <Box>
          <Stack
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              position: "relative",
              overflowY: "hidden",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 20, sm: 30, md: 45, lg: 70, xl: 80 },
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
              Amplify Your Brand With Influencers
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
              Connect with your audience through trusted voices. Partner with
              relevant influencers to expand your reach, build authentic trust,
              and drive sales for your brand.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row", md: "row" }}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
              sx={{
                gap: {
                  xs: 4,
                  sm: 8,
                  md: 12,
                  lg: 20,
                },
              }}
            >
              {/*    <Link>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    color: "black",
                    fontSize: { xs: 12, sm: 16, md: 18, lg: 20, xl: 22 },
                    transition: "all 0.3s ease",
                    textTransform: "none",
                    fontWeight: "normal",
                    height: { xs: "40px", sm: "50px", md: "60px", lg: "70px" },
                    textWrap: "nowrap",
                    "&:hover": {
                      transform: "scale(1.05)",
                      //backgroundColor: "#f0f0f0",
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  Open Caskayd Web
                </Button>
              </Link> */}
              <Link style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "12px",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    display: "inline-flex",
                    height: { xs: "40px", sm: "50px", md: "60px", lg: "70px" },
                    alignItems: "center",
                    "&:hover": {
                      transform: "scale(1.05)",
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  <Stack
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      sx={{
                        height: {
                          xs: "15px",
                          sm: "18px",
                          md: "24px",
                          lg: "30px",
                        },
                        width: {
                          xs: "15px",
                          sm: "18px",
                          md: "24px",
                          lg: "30px",
                        },
                      }}
                    >
                      <FontAwesomeIcon icon={faGooglePlay} />
                    </Box>

                    <Stack
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        textAlign: "left",
                        marginLeft: 10,
                      }}
                    >
                      <Typography
                        sx={{
                          textWrap: "nowrap",
                          fontSize: {
                            xs: "9px",
                            sm: "10px",
                            md: "12px",
                            lg: "14px",
                          },
                          textTransform: "uppercase",
                          fontWeight: "light",
                          textAlign: "left",
                        }}
                      >
                        Get it on
                      </Typography>
                      <Typography
                        sx={{
                          textWrap: "nowrap",
                          fontSize: {
                            xs: "15px",
                            sm: "18px",
                            md: "21px",
                            lg: "24px",
                          },
                        }}
                      >
                        Google Play
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              </Link>
              <Link style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "12px",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    display: "inline-flex",
                    height: { xs: "40px", sm: "50px", md: "60px", lg: "70px" },
                    alignItems: "center",
                    "&:hover": {
                      transform: "scale(1.05)",
                      backgroundColor: "#111",
                    },
                  }}
                >
                  <Stack
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      sx={{
                        height: {
                          xs: "15px",
                          sm: "18px",
                          md: "24px",
                          lg: "30px",
                        },
                        width: {
                          xs: "15px",
                          sm: "18px",
                          md: "24px",
                          lg: "30px",
                        },
                      }}
                    >
                      <FontAwesomeIcon icon={faApple} />
                    </Box>

                    <Stack
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginLeft: 10,
                      }}
                    >
                      <Typography
                        sx={{
                          textWrap: "nowrap",
                          fontSize: {
                            xs: "9px",
                            sm: "10px",
                            md: "12px",
                            lg: "14px",
                          },
                        }}
                      >
                        Download on the
                      </Typography>
                      <Typography
                        sx={{
                          textWrap: "nowrap",
                          fontSize: {
                            xs: "15px",
                            sm: "18px",
                            md: "21px",
                            lg: "24px",
                          },
                        }}
                      >
                        App Store
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Box>
        <Stack
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "800px",
            aspectRatio: "4 / 2",
            bottom: 0,
            height: { xs: "15vh", sm: "20vh", md: "20vh", lg: "40vh" },
            marginTop: 10,
          }}
        >
          <Image
            src="/images/AmplifyYourBrandWithInfluencers.png"
            alt="amp"
            fill
            style={{ objectFit: "inherit", borderRadius: 10 }}
          />
        </Stack>
      </div>
      <Typography
        sx={{
          fontSize: { xs: 15, sm: 25, md: 30, lg: 50, xl: 65 },
          color: "white",
          fontWeight: "light",
          letterSpacing: 2,
          /* textTransform: "uppercase", */
          marginTop: 5,
          fontFamily: "Roboto, sans-serif",
          paddingLeft: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
          paddingRight: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
          mb: 4,
        }}
      >
        Advertise with any of your platforms
      </Typography>
      <Stack
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "95%",
          overflowY: "hidden",
          height: 100,
        }}
        sx={{
          gap: {
            xs: 4,
            sm: 8,
            md: 12,
            lg: 20,
          },
          marginBottom: {
            xs: 0.5,
            sm: 1,
            md: 1.5,
            lg: 3,
          },
        }}
      >
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          sx={{
            gap: {
              xs: 0.4,
              sm: 0.6,
              md: 0.8,
              lg: 1,
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <FontAwesomeIcon icon={faInstagram} style={{ color: "white" }} />
          </Box>
        </Stack>
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          sx={{
            gap: {
              xs: 0.4,
              sm: 0.6,
              md: 0.8,
              lg: 1,
            },
          }}
        >
          {" "}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <FontAwesomeIcon icon={faFacebookF} style={{ color: "white" }} />
          </Box>
        </Stack>
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          sx={{
            gap: {
              xs: 0.4,
              sm: 0.6,
              md: 0.8,
              lg: 1,
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <FontAwesomeIcon icon={faTiktok} style={{ color: "white" }} />
          </Box>
        </Stack>
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          sx={{
            gap: {
              xs: 0.4,
              sm: 0.6,
              md: 0.8,
              lg: 1,
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <FontAwesomeIcon icon={faYoutube} style={{ color: "white" }} />
          </Box>
        </Stack>
      </Stack>
      <Stack
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "95%",
          overflowY: "hidden",
          height: 100,
        }}
        sx={{
          gap: {
            xs: 4,
            sm: 8,
            md: 12,
            lg: 20,
          },
          marginBottom: {
            xs: 2,
            sm: 4,
            md: 6,
            lg: 8,
          },
        }}
      >
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          sx={{
            gap: {
              xs: 0.4,
              sm: 0.6,
              md: 0.8,
              lg: 1,
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <FontAwesomeIcon icon={faXTwitter} style={{ color: "white" }} />
          </Box>
        </Stack>
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          sx={{
            gap: {
              xs: 0.4,
              sm: 0.6,
              md: 0.8,
              lg: 1,
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <FontAwesomeIcon icon={faWhatsapp} style={{ color: "white" }} />
          </Box>
        </Stack>
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          sx={{
            gap: {
              xs: 0.4,
              sm: 0.6,
              md: 0.8,
              lg: 1,
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <FontAwesomeIcon
              icon={faSnapchatGhost}
              style={{ color: "white" }}
            />
          </Box>
        </Stack>
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          sx={{
            gap: {
              xs: 0.4,
              sm: 0.6,
              md: 0.8,
              lg: 1,
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <FontAwesomeIcon
              icon={faTelegramPlane}
              style={{ color: "white" }}
            />
          </Box>
        </Stack>
      </Stack>
      <Stack
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 17, sm: 26, md: 38, lg: 50, xl: 60 },
            color: "white",
            fontWeight: "bold",
            letterSpacing: 2,
            /* textTransform: "uppercase", */
            marginBottom: 2,
            fontFamily: "Roboto, sans-serif",
            paddingLeft: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
            paddingRight: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
          }}
        >
          Connect With Top Influencers And Drive Results
        </Typography>
      </Stack>
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
        Work with trusted creators and join campaigns that deliver real impact.
      </Typography>
      <div className="earn">
        <Stack
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "800px",
            aspectRatio: "4 / 2",
            bottom: 0,
            height: { xs: "30vh", sm: "40vh", md: "45vh", lg: "80vh" },
            marginTop: 10,
          }}
        >
          <Image
            src="/images/ConnectWithTopInfluencers.png"
            alt="con"
            fill
            style={{ objectFit: "inherit", borderRadius: 10 }}
          />
        </Stack>
      </div>
      <Stack
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 17, sm: 26, md: 38, lg: 50, xl: 60 },
            color: "white",
            fontWeight: "bold",
            letterSpacing: 2,
            /* textTransform: "uppercase", */
            marginBottom: 2,
            fontFamily: "Roboto, sans-serif",
            paddingLeft: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
            paddingRight: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
          }}
        >
          Maximize You Reach With Group Campaigns
        </Typography>
      </Stack>
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
        Manage multiple creators with ease and track conversions in one
        dashboard
      </Typography>
      <div className="skip">
        <Stack
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "800px",
            aspectRatio: "4 / 2",
            bottom: 0,
            height: { xs: "30vh", sm: "40vh", md: "45vh", lg: "80vh" },
            marginTop: 10,
          }}
        >
          <Image
            src="/images/MaximizeYourReach.png"
            alt="max"
            fill
            style={{ objectFit: "inherit", borderRadius: 10 }}
          />
        </Stack>
      </div>
      <Stack style={{ width: "100%", textAlign: "left" }}>
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 30, md: 45, lg: 70, xl: 80 },
            color: "white",
            fontWeight: "bold",
            letterSpacing: 3,
            /* textTransform: "uppercase", */
            marginBottom: 2,
            fontFamily: "Roboto, sans-serif",
            paddingLeft: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
            paddingRight: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
            mb: 4,
          }}
        >
          Try Caskayd Now
        </Typography>
      </Stack>
      <Stack
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          width: "100%",
          marginBottom: 150,
          paddingLeft: 20,
        }}
      >
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Stack
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              width: "45%",
            }}
          >
            {/* <Link>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  color: "black",
                  fontSize: { xs: 12, sm: 16, md: 18, lg: 20, xl: 22 },
                  marginLeft: { xs: 2, sm: 4, md: 7, lg: 10, xl: 12 },
                  mb: { xs: 2, sm: 3, md: 4, lg: 5, xl: 12 },
                  width: "100%",
                  transition: "all 0.3s ease",
                  textTransform: "none",
                  fontWeight: "normal",
                  height: { xs: "40px", sm: "50px", md: "60px", lg: "70px" },
                  textWrap: "nowrap",
                  "&:hover": {
                    transform: "scale(1.05)",
                    //backgroundColor: "#f0f0f0",
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                Open Caskayd Web
              </Button>
            </Link> */}
            <Stack
              direction={{ xs: "column", sm: "column", md: "row", lg: "row" }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: "100%",
                padding: 2,
              }}
              sx={{
                gap: {
                  xs: 3,
                  sm: 6,
                  md: 8,
                  lg: 10,
                },
              }}
            >
              <Link style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "12px",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    display: "inline-flex",
                    height: { xs: "40px", sm: "50px", md: "60px", lg: "70px" },
                    marginLeft: { xs: 2, sm: 4, md: 7, lg: 10, xl: 12 },
                    alignItems: "center",
                    "&:hover": {
                      transform: "scale(1.05)",
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  <Stack
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      sx={{
                        height: {
                          xs: "15px",
                          sm: "18px",
                          md: "24px",
                          lg: "30px",
                        },
                        width: {
                          xs: "15px",
                          sm: "18px",
                          md: "24px",
                          lg: "30px",
                        },
                      }}
                    >
                      <FontAwesomeIcon icon={faGooglePlay} />
                    </Box>

                    <Stack
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        textAlign: "left",
                        marginLeft: 10,
                      }}
                    >
                      <Typography
                        sx={{
                          textWrap: "nowrap",
                          fontSize: {
                            xs: "9px",
                            sm: "10px",
                            md: "12px",
                            lg: "14px",
                          },
                          textTransform: "uppercase",
                          fontWeight: "light",
                          textAlign: "left",
                        }}
                      >
                        Get it on
                      </Typography>
                      <Typography
                        sx={{
                          textWrap: "nowrap",
                          fontSize: {
                            xs: "15px",
                            sm: "18px",
                            md: "21px",
                            lg: "24px",
                          },
                        }}
                      >
                        Google Play
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              </Link>
              <Link style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "12px",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    display: "inline-flex",
                    height: { xs: "40px", sm: "50px", md: "60px", lg: "70px" },
                    alignItems: "center",
                    "&:hover": {
                      transform: "scale(1.05)",
                      backgroundColor: "#111",
                    },
                  }}
                >
                  <Stack
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      sx={{
                        height: {
                          xs: "15px",
                          sm: "18px",
                          md: "24px",
                          lg: "30px",
                        },
                        width: {
                          xs: "15px",
                          sm: "18px",
                          md: "24px",
                          lg: "30px",
                        },
                      }}
                    >
                      <FontAwesomeIcon icon={faApple} />
                    </Box>

                    <Stack
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginLeft: 10,
                      }}
                    >
                      <Typography
                        sx={{
                          textWrap: "nowrap",
                          fontSize: {
                            xs: "9px",
                            sm: "10px",
                            md: "12px",
                            lg: "14px",
                          },
                        }}
                      >
                        Download on the
                      </Typography>
                      <Typography
                        sx={{
                          textWrap: "nowrap",
                          fontSize: {
                            xs: "15px",
                            sm: "18px",
                            md: "21px",
                            lg: "24px",
                          },
                        }}
                      >
                        App Store
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              </Link>
            </Stack>
          </Stack>
          <Stack style={{ width: "60%", right: 0, paddingRight: 20 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "light",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "Roboto, sans-serif",
                textAlign: "right",
                background: "linear-gradient(to right, #846120, #9D2424, #8D077B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text", // for non-webkit browsers
                color: "transparent", // fallback
              }}
            >
             Caskayd
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          marginBottom: 50,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: "light",
            letterSpacing: 2,
            /* textTransform: "uppercase", */
            fontFamily: "Roboto, sans-serif",
            paddingLeft: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
            paddingRight: { xs: 2, sm: 6, md: 8, lg: 10, xl: 13 },
            fontSize: { xs: 9, sm: 12, md: 14, lg: 17, xl: 22 },
            mb: 8,
          }}
        >
          Follow us on
        </Typography>
        <Stack
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
            height: "50px",
            marginTop: 3,
          }}
          sx={{
            gap: {
              xs: 3,
              sm: 6,
              md: 8,
              lg: 10,
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <Link
              href=""
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                color: "white",
                textDecoration: "none",
              }}
            >
              <FontAwesomeIcon icon={faXTwitter} style={{ color: "white" }} />
            </Link>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <Link
              href=""
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                color: "white",
                textDecoration: "none",
              }}
            >
              <FontAwesomeIcon icon={faFacebookF} style={{ color: "white" }} />
            </Link>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <Link
              href=""
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                color: "white",
                textDecoration: "none",
              }}
            >
              <FontAwesomeIcon icon={faLinkedin} style={{ color: "white" }} />
            </Link>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{
              height: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
              width: {
                xs: "15px",
                sm: "18px",
                md: "24px",
                lg: "30px",
              },
            }}
          >
            <Link
              href=""
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                color: "white",
                textDecoration: "none",
              }}
            >
              <FontAwesomeIcon icon={faInstagram} style={{ color: "white" }} />
            </Link>
          </Box>
        </Stack>
      </Stack>
    </div>
  );
}
