import { ImageResponse } from "next/og";

export const runtime = "edge";

async function loadGoogleFont(font: string, weight?: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${
    weight || 400
  }&display=swap`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const attendance = searchParams.has("att")
      ? Number(searchParams.get("att"))
      : 0;
    const locations = searchParams.has("loc")
      ? Number(searchParams.get("loc"))
      : 0;

    const topParkrun = searchParams.has("top") ? searchParams.get("top") : "";

    const topParkrunAttendance = searchParams.has("topAtt")
      ? Number(searchParams.get("topAtt"))
      : 0;

    const year = searchParams.has("year")
      ? Number(searchParams.get("year"))
      : 0;
    const plural = (num: number) => (num == 1 ? "" : "s");

    const elementwidth = 1618.5;
    const maxWidthcalc = elementwidth - 82 * 2;

    return new ImageResponse(
      (
        <div
          id="parkruns"
          style={{
            height: "100%",
            width: "100%",
            textAlign: "center",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            display: "flex",
            color: "#fff",
            lineHeight: "1.5",
            rowGap: "138px",
            fontSize: "103px",
            backgroundColor: "#2B2C2E",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: `${maxWidthcalc}px`,
            }}
          >
            <div style={{ display: "flex" }}>
              You{year == 0 ? "'ve" : ""} attended
              <span style={{ opacity: 0 }}>l</span>
              <span
                style={{ color: "#EA0B86", fontFamily: "gabaritobold" }}
              >{`${attendance}`}</span>
              <span style={{ opacity: 0 }}>l</span>
            </div>
            <span style={{ display: "flex" }}>
              Parkrun{plural(attendance)} At
            </span>
            <div style={{ display: "flex" }}>
              <span
                style={{ color: "#EA0B86", fontFamily: "gabaritobold" }}
              >{`${locations}`}</span>
              <span style={{ opacity: 0 }}>l</span>location{plural(locations)}{" "}
              {year == 0 ? "" : `in ${year}`}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // Center spans horizontally within this div
              flexDirection: "column",
              maxWidth: `${maxWidthcalc}px`,
            }}
          >
            <div style={{ display: "flex" }}>
              Your top Parkrun {year == 0 ? "is" : "was"}
            </div>
            <div
              style={{
                color: "#EA0B86",
                fontSize: "223px",
                fontFamily: "gabaritobold",
                display: "flex",
              }}
            >
              {topParkrun}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center", // Center spans horizontally within this div
              }}
            >
              Where you{year == 0 ? "'ve" : ""} attended
              <span style={{ opacity: 0 }}>l</span>
              <span
                style={{ color: "#EA0B86", fontFamily: "gabaritobold" }}
              >{`${topParkrunAttendance}`}</span>
              <span style={{ opacity: 0 }}>l</span>Parkrun
              {plural(topParkrunAttendance)}
            </div>
          </div>
        </div>
      ),

      {
        width: 1618.5,
        height: 2135.25,
        fonts: [
          {
            name: "gabarito",
            data: await loadGoogleFont("Gabarito", 400),
            style: "normal",
          },
          {
            name: "gabaritobold",
            data: await loadGoogleFont("Gabarito", 900),
            style: "normal",
          },
        ],
      } // Ensure correct size for OG image
    );
  } catch (e: any) {
    return new Response(e.message);
  }
}
