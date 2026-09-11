import { css } from 'styled-system/css';

export default function App() {
  return (
    <main
      className={css({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4',
        p: '8',
      })}
    >
      <h1 className={css({ fontSize: '3xl', fontWeight: 'bold' })}>
        reapti-02
      </h1>
      <p className={css({ color: 'gray.600' })}>Ready for development.</p>
    </main>
  );
}
