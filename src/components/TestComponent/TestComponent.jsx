import styles from './TestComponent.module.css';

export default function TestComponent() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Test Component</h2>
      <p className={styles.description}>If this text is styled, CSS modules are working correctly.</p>
    </div>
  );
}