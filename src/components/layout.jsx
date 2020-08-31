import Banner from './banner';
import BottomBar from './bottom_bar';

export default function Layout({children}) {
  return (
    <>
      <Banner />
      {children}
      <BottomBar />
    </>
  );
}
