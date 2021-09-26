const About = () => {
  return (
    <div className="space-y-3">
      <div className="flex justify-center  bg-gradient-to-r from-green-700 to-green-400 py-8 text-center">
        <div className="flex flex-col justify-center max-w-lg w-full text-2xl font-semibold leading-snug text-white">
          My financial portfolio
          <a
            className="underline text-green-100 block"
            href="https://github.com/minho42/portfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
