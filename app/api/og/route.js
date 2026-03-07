import { getLogo } from "@/app/layout";
import Image from "next/image";
import { ImageResponse } from "next/og";

export const runtime = "edge";



export async function GET(req) {
  const pageLogo = await getLogo()
  const { searchParams } = new URL(req.url);
  const hasTitle = searchParams.has("title");
  const title = hasTitle ? searchParams.get("title") : "My";
  const logo = await fetch(new URL("/public/og.png", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );
  const options = {
    width: 512,
    height: 512,
  };

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-.02em",
          backgroundImage:
            "linear-gradient(to right, rgb(15, 23, 42), rgb(88, 28, 135), rgb(15, 23, 42))",
          fontFamily: "Helvetica",
          border: "4px solid yellow",
        }}
      >
        <div
          style={{
            left: 42,
            top: 42,
            position: "absolute",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image height={48} alt="logo" width={48} src={logo} />
          <span
            style={{
              marginLeft: 16,
              fontSize: 40,
              color: "#fff",
            }}
          >
            Logo
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "20px 50px",
            margin: "0 42px",
            fontSize: 40,
            width: "auto",
            maxWidth: 550,
            textAlign: "center",
            color: "white",
            lineHeight: 1.4,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      </div>
    ),
    options
  );
}
