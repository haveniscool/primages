import { ImageResponse } from "next/og";

export const runtime = "edge";

const getRandomTimeComparison = (timeInMinutes: number): string => {
  if (timeInMinutes <= 0) return "";

  const times = [
    { description: "you could've binged every season of Friends", time: 5321 },
    { description: "you could've watched the marathon world record", time: 121.65 },
    { description: "you could've binged Game of Thrones", time: 3952.3 },
    { description: "you could've watched the full Star Wars saga", time: 1617 },
    { description: "you could've completed the entire Lord of the Rings trilogy", time: 683 },
    { description: "the ISS orbited the Earth", time: 90 },
    { description: "the Apollo 11 could've flown to the moon and back", time: 11719 },
    { description: "you could've brushed your teeth", time: 2 },
    { description: "you played the shortest possible game of chess", time: 0.25 },
    { description: "you could've watched the longest game of professional American football", time: 4960 },
    { description: "you could've played a game of football", time: 90 },
    { description: "you could've watched Barbie (2024) and Oppenheimer", time: 294.15 },
    { description: "you could've watched The Muppet Movie", time: 97 },
  ];

  const comparisons = times
    .map((item) => {
      const comparedTime = item.time > timeInMinutes
        ? item.time / timeInMinutes
        : timeInMinutes / item.time;
      return { desc: item.description, comp: Math.round(comparedTime) };
    })
    .filter((item) => item.comp > 1);

  if (comparisons.length === 0) {
    return "No valid comparisons available";
  }

  const randComp = comparisons[Math.floor(Math.random() * comparisons.length)];
  return `In that time ${randComp.desc} ${randComp.comp} times`;
};

async function loadGoogleFont(font: string, weight?: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight || 400}&display=swap`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.ok) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("Failed to load font data");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const time = searchParams.has("time") ? Number(searchParams.get("time")) : 0;
    const year = searchParams.has("year") ? Number(searchParams.get("year")) : 0;


    const plural = (num: number) => (num === 1 ? "" : "S");

    const elementwidth = 1618.5;
    const maxWidthcalc = elementwidth - 82 * 2;

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "#FFA300",
            height: "100%",
            width: "100%",
            textAlign: "center",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            display: "flex",
            color: "#fff",
            rowGap: "108px",
            fontSize: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              maxWidth: `${maxWidthcalc}px`,
              rowGap: "18px",
            }}
          >
            <div style={{ fontSize: "73px", display: "flex" }}>
              {year === 0 ? "YOU'VE" : `IN ${year} YOU`} SPENT A TOTAL OF
            </div>
            <div
              style={{
                fontFamily: "Gabaritobold",
                fontSize: "202px",
                fontWeight: "900",
                display: "flex",
              }}
            >
              {time}
            </div>
            <div style={{ fontSize: "73px", display: "flex" }}>
              MINUTE{plural(time)} PARKRUNNING
            </div>
          </div>
          <div
            style={{
              fontSize: "73px",
              letterSpacing: "-1.25px",
              maxWidth: `${maxWidthcalc}px`,
              display: "flex",
            }}
          >
            {getRandomTimeComparison(time)}
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
      }
    );
  } catch (e: any) {
    return new Response(e.message, { status: 400 });
  }
}
