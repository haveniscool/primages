import { ImageResponse } from 'next/og';

export const runtime = "edge";

async function loadGoogleFont (font: string, weight?: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight || 400}&display=swap`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)
 
  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }
 
  throw new Error('failed to load font data')
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const fastestagegrade = searchParams.has("fastAG")
      ? Number(searchParams.get("fastAG"))
      : 0;

      const year = searchParams.has("year")
      ? Number(searchParams.get("year"))
      : 0;

      const avgagegrade = searchParams.has("avgAG")
      ? Number(searchParams.get("avgAG"))
      : 0;


      const elementwidth = 1618.5
      const maxWidthcalc = elementwidth - (82 * 2)

    return new ImageResponse(
      (
        <div
        style={{
            backgroundColor: '#75a42e',
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
        <div
          style={{
            fontSize: '73px',
            maxWidth: `${maxWidthcalc}px`,
            display: "flex"
          }}
          >
          Your fastest age grade {year == 0 ? "is" : `in ${year} was`}
        </div>
        <div
  style={{
    color: '#e4e643',
    fontSize: '202px',
    fontFamily: 'gabaritobold',
    display: "flex",
    maxWidth: `${maxWidthcalc}px`
  }}>
      {fastestagegrade}%
</div>
        <div
          style={{
            fontSize: '73px',
            display: "flex",
            maxWidth: `${maxWidthcalc}px`
          }}>
            Your average age grade {(year == 0 ? "is" : `was`)} <span style={{opacity: 0}}>l</span>
          <span
            style={{
              fontFamily: 'gabaritobold',
              color: '#e4e643',
            }}>
          {avgagegrade}%
          </span>
        </div>
      </div>

      ),
      { width: 1618.5, height: 2135.25,
        fonts: [
          {
            name: 'gabarito',
            data: await loadGoogleFont('Gabarito', 400),
            style: 'normal',
          },
          {
            name: 'gabaritobold',
            data: await loadGoogleFont('Gabarito', 900),
            style: 'normal',
          },
        ],
       } // Ensure correct size for OG image
    );
  } catch(e) {
    console.log("d")
  }
}
