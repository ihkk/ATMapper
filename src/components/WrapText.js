export default function wrapText(context, text, x, initialY, maxWidth, lineHeight) {
    let y = initialY;
    let line = '';

    for (let n = 0; n < text.length; n++) {
        let testLine = line + text[n];
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = text[n];
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    return y + lineHeight;
}