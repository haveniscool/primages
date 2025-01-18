import { ImageResponse } from "next/og";

export const runtime = "edge";


const getDistanceComparison = (distance: number) => {
  let comparison = {
    height: {
      "the Eiffel Tower": 0.3300984,
      "the Statue of Liberty": 0.04605,
      "the Great Pyramid of Giza": 0.137,
      "the Empire State Building": 0.38,
      "the Burj Khalifa": 0.828,
      "Mount Everest": 8.849,
      "the One World Trade Center": 0.5413248,
      "Big Ben": 0.096,
      "Taipei 101": 0.509,
      "the CN Tower": 0.5533,
      "the Chichen Itza Pyramid": 0.03,
      "the Leaning Tower of Pisa (Without the Slant)": 0.05836,
      "the Acropolis": 0.156,
      "the Shard": 0.3096,
      "Tokyo Tower": 0.333,
      "Willis Tower": 0.442,
      "the Petronas Towers": 0.452,
      "Neuschwanstein Castle": 0.065,
      "Mont Blanc": 4.80559,
      "Mount Fuji": 3.776,
      "the Burj Al Arab": 0.321,
      "Sagrada Familia": 0.1725,
      "Mount Kilimanjaro": 5.895,
      "Vatican St. Peter’s Dome": 0.13657,
      "the Chrysler Building": 0.319,
      "St. Basil’s Cathedral": 0.0475,
      "the Tokyo Skytree": 0.634,
      "Mount St. Helens": 2.549,
      "Mount Elbrus": 5.641848,
      "the Sydney Tower Eye": 0.268,
      "the Palace of Westminster": 0.0985,
      "the Hyperion Tree": 0.11555,
    },
    length: {
      "the Golden Gate Bridge": 2.737,
      "the Sydney Harbour Bridge": 1.149096,
      "the Great Wall of China": 21196.67,
      "the Amazon River": 6400.361,
      "the Colorado River": 2333.549,
    },
    perimeter: {
      "the Colosseum": 0.545,
    },
    circumference: {
      "the Earth": 40074.275,
      Jupiter: 439264.007,
    },
    depth: {
      "the Mariana Trench": 10.984,
      "Lake Baikal": 1.642,
    },
    distance: {
      "the Earth to the Moon": 384400,
      "New York to Los Angeles": 4488.62135,
    },
  };

  const getAmountComparison = (a: any, b: any) => {
    if (a <= 0 || b <= 0) return 1;
    return a > b ? a / b : b / a;
  };

  const allEntries = Object.entries(comparison).flatMap(([cat, items]) =>
    Object.entries(items).map(([name, value]) => ({
      category: cat,
      name,
      value,
    }))
  );

  const randomEntry =
    allEntries.length > 0
      ? allEntries[Math.floor(Math.random() * allEntries.length)]
      : { category: "unknown", name: "unknown", value: 1 };

  const comparisonResult = getAmountComparison(distance, randomEntry.value);

  return comparisonResult
    ? `${Math.round(comparisonResult)} times the ${randomEntry.category}${
        randomEntry.category === "distance" ? " from " : " of "
      }${randomEntry.name}`
    : "";
};

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

    const totaldist = searchParams.has("dist")
      ? Number(searchParams.get("dist"))
      : 0;

    const year = searchParams.has("year")
      ? Number(searchParams.get("year"))
      : 0;

    const unit = searchParams.has("un") ? Number(searchParams.get("un")) : 0;
    const plural = (num: number) => (num == 1 ? "" : "s");

    const elementwidth = 1618.5;
    const maxWidthcalc = elementwidth - 82 * 2;
    return new ImageResponse(
      (
        <div
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
            rowGap: "108px",
            fontSize: "80px",
            backgroundColor: "#E6224B",
          }}
        >
          <div
            style={{
              fontSize: "73px",
              display: "flex",
              maxWidth: `${maxWidthcalc}px`,
            }}
          >
            {year == 0
              ? "You've been on a journey"
              : `In ${year} you went on a journey`}
          </div>

          <div
            style={{
              fontSize: "160px",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center", // Center spans horizontally within this div
              gap: "10px",
              fontFamily: "gabaritobold",
              maxWidth: `${maxWidthcalc}px`,
            }}
          >
            <span>You&apos;ve traveled a total of</span>

            <span style={{ color: "#E4E643", display: "flex" }}>
              {`${totaldist}`}
              <span style={{ opacity: 0 }}>l</span>
              {unit == 0 ? "Kilometer" : `Meter`}
              {plural(totaldist)}
            </span>
          </div>

          <div
            style={{
              fontSize: "73px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // Center spans horizontally within this div
              flexWrap: "wrap",
              maxWidth: `${maxWidthcalc}px`,
            }}
          >
            <span>That&apos;s</span>
            <span style={{ opacity: 0 }}>l</span>
            <span style={{ color: "#E4E643" }}>
              {getDistanceComparison(Number(totaldist))}
            </span>
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
    return new Response(e.message);
  }
}