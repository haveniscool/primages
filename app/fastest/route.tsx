import { ImageResponse } from "next/og";

export const runtime = "edge";

async function loadGoogleFont(font: string, weight?: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight || 400}&display=swap`;
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

    const fastSec = searchParams.has("fastSec")
    ? Number(searchParams.get("fastSec"))
    : 0;

    const fastMin = searchParams.has("fastMin")
    ? Number(searchParams.get("fastMin"))
    : 0;

    const fastHour = searchParams.has("fastHour")
    ? Number(searchParams.get("fastHour"))
    : 0;

  const year = searchParams.has("year")
    ? Number(searchParams.get("year"))
    : 0;

    const parkrun = searchParams.has("parkrun")
    ? searchParams.get("parkrun")
    : "";

    const date = searchParams.has("date")
    ? searchParams.get("date")
    : 0;

    const plural = (num: number) => num == 1 ? "" : "s"

      const elementwidth = 1618.5
      const maxWidthcalc = elementwidth - (82 * 2)
    return new ImageResponse(
      (
        <div
        style={{
            backgroundColor: "#2B2C2E",
            height: '100%',
            width: '100%',
            textAlign: 'center',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            display: 'flex',
            color: '#fff',
            rowGap: '108px',
            fontSize: '80px',
        }}
      >
        <div style={{ fontSize: "73px", maxWidth: `${maxWidthcalc}px`
}}>{year == 0 ? "You've completed your fastest parkrun in" : `In ${year} you completed your fastest parkrun in`}</div>
        <div style={{ fontSize: "202px", fontFamily: "gabaritobold", color: "#FFA300", maxWidth: `${maxWidthcalc}px`, display: "flex"}}>
          {fastHour} hour{plural(fastHour)}, {fastMin} minute{plural(fastMin)}, and {fastSec} second{plural(fastSec)}
        </div>
        <div style={{ fontSize: "73px",maxWidth: `${maxWidthcalc}px`, display: "flex" }}>
            {!date ? "" : `On ${date?.toString().replaceAll(".","/")}`} {!parkrun ? "" : `at ${parkrun}`}
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
