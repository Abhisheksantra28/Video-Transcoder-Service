
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="hidden md:flex flex-col w-64 border-r bg-gray-100/40 dark:bg-gray-800/40">
        <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-800">
          <Link className="text-xl font-bold" href="#">
            Acme Inc
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="flex-1 py-4">
            <Link
              className="flex items-center h-10 px-4 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Dashboard
            </Link>
            <Link
              className="flex items-center h-10 px-4 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Team
            </Link>
            <Link
              className="flex items-center h-10 px-4 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Projects
            </Link>
            <Link
              className="flex items-center h-10 px-4 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Calendar
            </Link>
          </nav>
        </div>
      </div>

      
      <div className="flex-1 flex flex-col w-full min-h-0">
        <header className="flex h-14 items-center border-b border-gray-200 px-4 md:px-6 dark:border-gray-800">
          <Button className="md:hidden" size="icon" variant="outline">
            <ChevronLeftIcon className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <nav className="ml-4 md:ml-6 flex-1">
            <Link className="inline-block h-8 w-8 rounded-full overflow-hidden" href="#">
              <img
                alt="Avatar"
                className="w-8 h-8 object-cover"
                height="32"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "32/32",
                  objectFit: "cover",
                }}
                width="32"
              />
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4 md:gap-2">
            <Button className="rounded-full" size="icon" variant="ghost">
              <SearchIcon className="w-4 h-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button className="rounded-full" size="icon" variant="ghost">
              <BellIcon className="w-4 h-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button className="rounded-full" size="icon" variant="ghost">
              <img
                alt="Avatar"
                className="rounded-full"
                height="32"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "32/32",
                  objectFit: "cover",
                }}
                width="32"
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 flex flex-col min-h-0">
          <div className="grid flex-1 p-4 md:p-6 gap-4 md:gap-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="grid flex-1 min-h-0 p-4 rounded-lg bg-white shadow-md dark:bg-gray-950">
              Content goes here
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function BellIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}


function ChevronLeftIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}


function SearchIcon(prop:any) {
  return (
    <svg
      {...prop}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
