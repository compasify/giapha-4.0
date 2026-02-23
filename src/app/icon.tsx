import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
    const svgContent = await readFile(
        join(process.cwd(), 'public', 'logo.svg'),
        'utf-8',
    );

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img
                    src={`data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`}
                    width="64"
                    height="64"
                    alt=""
                />
            </div>
        ),
        { ...size },
    );
}
