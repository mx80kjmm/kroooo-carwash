
import Script from 'next/script';

type Props = {
    publisherId: string;
};

export default function GoogleAdSense({ publisherId }: Props) {
    if (!publisherId) return null;

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}
