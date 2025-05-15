import GenerateQr from "./forms/GenerateQr";

export default function Page() {
  return (
    <div className="flex items-center flex-col justify-center h-dvh relative">
      <GenerateQr />
      <div className='absolute bottom-4 right-4 z-50'>
        <div className='flex items-center gap-1 text-xs ' >
          <span>Developed by</span>
          <a className='underline' href={"https://ms-vishwanath.web.app"} target='_noblank'>
            ms-vishwanath</a>
        </div>
      </div>
    </div>
  )
}
