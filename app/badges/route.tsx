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

    const badges: string[] = searchParams.has("badges")
    ? (searchParams.get("badges")?.split(",") || []) // ex: ?badges=25v,50v,25r
    : [];  

  const year = searchParams.has("year")
    ? Number(searchParams.get("year"))
    : 0;

      const elementwidth = 1618.5
      const maxWidthcalc = elementwidth - (82 * 2)

      const badgeTemplate = (badge: string) => {
        return (
           <div style={{
                fontFamily: "'Montserrat', sans-serif",
                lineHeight: 1.5,
                textAlign: "center",
                boxSizing: "border-box",
                verticalAlign: "middle",
                fontSize: 0,
                margin: 0,
                width: "190px",
                height: "190px",
                backgroundImage: `url(https://parkrunwrapped.havenline.art/images/badges/${badge}.svg)`
              }}></div>
        )
      }


    return new ImageResponse(
      (
<div
  style={{
    backgroundColor: "#E4E643",
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
    fontFamily: "gabaritobold",
  }}
>
  <div style={{ fontSize: "115px", color: "#EA0B86", maxWidth: `${maxWidthcalc}px`} }>{year==0 ? "You&apos;ve accomplished a lot" : `You accomplished a lot in ${year}`}</div>
  <div style={{ fontSize: "73px", color: "#EA0B86" }}>Let&apos;s look at some of your achievements</div>
  <div
    style={{
      display: "flex",
      gap: "50px",
      alignContent: "center",
      flexWrap: "wrap",
      justifyContent: "center",
    }}
  >
      {badges.map((badge) => badgeTemplate(badge))}
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
