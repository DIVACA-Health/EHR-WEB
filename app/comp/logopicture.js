
const Logopicture = () => {
  return (
    <div className="w-[43%] h-[98%] rounded-2xl m-auto flex items-center justify-center bg-container relative bg-cover bg-center " style={{ backgroundImage: "url('/image/RIGHTIMAGE.png')" }}>
        <div className="absolute inset-0 bg-[rgba(20,37,79,0.8)] rounded-2xl z-10"></div>
        <div className="relative z-20 p-4 text-white h-full w-full flex items-center justify-center">
        <div className=" min-h-[90%] w-[85%] flex flex-col justify-between " >
            <img src="/image/DHLOGO.png" alt="logo"  width={164} height={56}/>
            <div>
            <div className=" mb-8 flex flex-col text-center gap-3">
                <h2 className="text-2xl font-bold">Your Data, Always Protected</h2>
                <h4 className="text-sm">Keep patient records safe with built-in security and seamless access controls.</h4>
            </div>
            <div className="flex justify-center items-center">
                <img src="/image/slide.png" alt="slider" width={88} height={10} />
            </div>
            </div>
        </div>
        </div>
  </div>
  )
}

export default Logopicture;