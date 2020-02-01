import { svg } from './lib/lit-html.js';

export const Minimize = svg`
<symbol id="svg-minimize" viewBox="0 0 16 16">
  <line x1="3" y1="8.5" x2="13" y2="8.5" stroke="currentColor" />
</symbol>`;

export const Close = svg`
<symbol id="svg-close" viewBox="0 0 16 16">
  <path d="M3.5 12.5L12.5 3.5M12.5 12.5L3.5 3.5" stroke="currentColor" />
</symbol>`;

export const Star = svg`
<symbol id="svg-star" viewBox="0 0 16 15">
  <path
    d="M8.47553 1.08156L9.5451 4.37336C9.74591 4.99139 10.3218 5.40983 10.9717 5.40983H14.4329C14.9172 5.40983 15.1186 6.02964 14.7268 6.31434L11.9266 8.34878C11.4009 8.73075 11.1809 9.4078 11.3817 10.0258L12.4513 13.3176C12.6009 13.7783 12.0737 14.1613 11.6818 13.8766L8.88168 11.8422C8.35595 11.4602 7.64405 11.4602 7.11832 11.8422L4.31815 13.8766C3.9263 14.1613 3.39906 13.7783 3.54873 13.3176L4.6183 10.0258C4.81911 9.4078 4.59913 8.73075 4.07339 8.34878L1.27323 6.31434C0.881369 6.02964 1.08276 5.40983 1.56712 5.40983H5.02832C5.67816 5.40983 6.25409 4.99139 6.4549 4.37336L7.52447 1.08156C7.67415 0.620903 8.32585 0.620903 8.47553 1.08156Z"
    fill="var(--star-fill)"
    stroke="var(--star-stroke)"
    stroke-width="var(--star-stroke-width)"
  />
</symbol>
`;
