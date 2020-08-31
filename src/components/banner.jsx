import styles from '../styles/banner.module.css';

import logo from '/content/images/qcr_logo_light.png';

export default function Banner() {
  return (
    <div className={styles.banner}>
      <img className={styles.logo} alt="QCR Logo (light)" src={logo} />
    </div>
  );
}
