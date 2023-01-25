const Header = () => {
  return (
    <div className="max-w-6xl mx-auto flex justify-end space-x-7 py-5 px-3">
      <a
        href="https://twitter.com/graymattersxyz"
        target="_blank"
        rel="noreferrer"
      >
        <img src="/images/twitter.png" className="w-[50px]" alt="" />
      </a>
      <a
          href="https://opensea.io/gray-matters"
          target="_blank"
          rel="noreferrer"
        >
        <img src="/images/opensea.png" className="w-[50px]" alt="" />
      </a>
    </div>
  );
};

export default Header;
