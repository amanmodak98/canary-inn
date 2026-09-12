import { ImageResponse } from "next/og";
import { HOTEL } from "@/lib/hotel";
import { IMAGES } from "@/data/images";

// Use the Node.js runtime so we can resolve local /hotel/* images at build
// time (the data/images module reads the filesystem). Slightly slower than
// edge for image generation, but only runs once per deploy.
export const runtime = "nodejs";
export const alt = `${HOTEL.name} ${HOTEL.address.city} — Hotel, Restaurant & Bar`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1C1611",
          color: "#FAF7F2",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Background image */}
        <img
          src={IMAGES.hero.primary}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.5,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(28,22,17,0.3), rgba(28,22,17,0.85))",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#FAF7F2",
            opacity: 0.7,
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ width: 32, height: 1, background: "#FAF7F2", opacity: 0.6 }} />
          {HOTEL.address.city} · {HOTEL.address.state}
        </div>

        {/* Title */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            right: 80,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-2px",
              maxWidth: 900,
              color: "#FAF7F2",
            }}
          >
            {HOTEL.name}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 36,
              fontStyle: "italic",
              color: "#C2724A",
              fontFamily: "cursive",
            }}
          >
            {HOTEL.tagline}
          </div>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 28,
              color: "#FAF7F2",
              opacity: 0.85,
              fontSize: 18,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            <span>3-Star Hotel</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Multi-cuisine Restaurant</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Bar & Lounge</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}