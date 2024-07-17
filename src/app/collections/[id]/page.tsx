"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import SearchBar from "@/components/custom/search-bar"
import { Download, Edit, XSquareIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Page(
  {
    params,
    searchParams
  }: {
    params: { id: string };
    searchParams?: { query?: string }
  }
) {
  const [currentPage, setCurrentPage] = useState(1)
  const [photosPerPage] = useState(20)
  const collection = {
    "id": 1,
    "name": "Collection Name",
    "status": "Completed",
    "imageCount": 10,
    "createdAt": new Date(),
    "photos": [
      {
        id: 1,
        title: "Sunset over the Vast and Captivating Ocean with Crashing Waves",
        description:
          "A breathtaking scene of the sun dipping below the horizon, casting a warm glow over the vast and powerful ocean. The crashing waves create a mesmerizing and serene atmosphere.",
        keywords: [
          "sunset",
          "ocean",
          "beach",
          "landscape",
          "waves",
          "serene",
          "dramatic",
          "tranquil",
          "coastal",
          "natural",
          "picturesque",
          "breathtaking",
          "majestic",
          "scenic",
          "beautiful",
        ],
        imageUrl: "/placeholder.svg",
      },
      {
        id: 2,
        title: "Vibrant and Colorful Tulips Blooming in a Lush Garden",
        description:
          "A vibrant and captivating display of tulips in a lush, well-tended garden. The flowers burst with a rainbow of colors, creating a visually stunning and serene scene.",
        keywords: [
          "flowers",
          "tulips",
          "nature",
          "colorful",
          "garden",
          "spring",
          "bloom",
          "horticulture",
          "botany",
          "flora",
          "petals",
          "vibrant",
          "lush",
          "verdant",
          "stunning",
        ],
        imageUrl: "/placeholder.svg",
      },
      {
        id: 3,
        title: "Majestic and Towering Mountain Range Reaching for the Skies",
        description:
          "A breathtaking view of a majestic mountain range, with towering peaks reaching high into the sky. The rugged, snow-capped granite formations create a sense of awe and wonder.",
        keywords: [
          "mountains",
          "landscape",
          "nature",
          "scenic",
          "peaks",
          "alpine",
          "rugged",
          "snow-capped",
          "granite",
          "wilderness",
          "adventure",
          "exploration",
          "grandeur",
          "awe-inspiring",
          "magnificent",
        ],
        imageUrl: "/placeholder.svg",
      },
      {
        id: 4,
        title: "Serene and Tranquil Lake Reflecting the Surrounding Landscape",
        description:
          "A peaceful and serene lake, with a mirror-like surface reflecting the surrounding landscape. The calm, still waters create a sense of tranquility and calmness.",
        keywords: [
          "lake",
          "reflection",
          "nature",
          "calm",
          "mirror",
          "still",
          "peaceful",
          "serene",
          "tranquil",
          "pristine",
          "picturesque",
          "idyllic",
          "scenic",
          "calming",
          "soothing",
        ],
        imageUrl: "/placeholder.svg",
      },
      {
        id: 5,
        title: "Bustling and Vibrant City Skyline with Towering Skyscrapers",
        description:
          "A dynamic and captivating view of a bustling city skyline, with towering skyscrapers reaching high into the sky. The concrete, glass, and steel structures create a sense of modern, metropolitan energy.",
        keywords: [
          "city",
          "skyline",
          "architecture",
          "urban",
          "skyscrapers",
          "high-rise",
          "modern",
          "metropolitan",
          "bustling",
          "vibrant",
          "dynamic",
          "concrete",
          "glass",
          "steel",
          "cityscape",
        ],
        imageUrl: "/placeholder.svg",
      },
      {
        id: 6,
        title: "Stunning and Colorful Autumn Foliage Painting the Landscape",
        description:
          "A breathtaking display of autumn foliage, with a vibrant palette of colors painting the landscape. The changing leaves create a visually stunning and picturesque scene.",
        keywords: [
          "autumn",
          "leaves",
          "nature",
          "colors",
          "fall",
          "foliage",
          "trees",
          "deciduous",
          "vibrant",
          "changing",
          "seasonal",
          "palette",
          "stunning",
          "picturesque",
          "breathtaking",
        ],
        imageUrl: "/placeholder.svg",
      },
      {
        id: 7,
        title: "Mysterious and Enchanting Misty Forest with Towering Trees",
        description:
          "A captivating and mysterious forest, shrouded in a misty, ethereal atmosphere. The towering trees and canopy create a sense of enchantment and tranquility.",
        keywords: [
          "forest",
          "nature",
          "mist",
          "tranquil",
          "fog",
          "ethereal",
          "mysterious",
          "enchanting",
          "moody",
          "atmospheric",
          "towering",
          "trees",
          "canopy",
          "wilderness",
          "serene",
        ],
        imageUrl: "/placeholder.svg",
      },
      {
        id: 8,
        title: "Captivating and Powerful Waterfall Cascading Down a Rugged Cliff",
        description:
          "A majestic and awe-inspiring waterfall, cascading down a rugged, rocky cliff. The powerful, rushing water creates a captivating and mesmerizing scene.",
        keywords: [
          "waterfall",
          "nature",
          "landscape",
          "scenic",
          "cascade",
          "rushing",
          "powerful",
          "roaring",
          "rugged",
          "cliff",
          "rock",
          "flowing",
          "captivating",
          "majestic",
          "awe-inspiring",
        ],
        imageUrl: "/placeholder.svg",
      },
      {
        id: 9,
        title: "Vibrant and Colorful Flower Garden Bursting with Life and Beauty",
        description:
          "A lush and verdant flower garden, bursting with a vibrant array of colors and blooms. The captivating display of flora creates a visually stunning and breathtaking scene.",
        keywords: [
          "flowers",
          "garden",
          "nature",
          "colorful",
          "bloom",
          "horticulture",
          "botany",
          "flora",
          "petals",
          "vibrant",
          "lush",
          "verdant",
          "stunning",
          "picturesque",
          "breathtaking",
        ],
        imageUrl: "/placeholder.svg",
      },
      {
        id: 10,
        title: "Dramatic and Powerful Thunderstorm with Striking Lightning Bolts",
        description:
          "A captivating and electrifying thunderstorm, with powerful lightning bolts streaking across the sky. The intensity and force of the storm create a sense of awe and wonder.",
        keywords: [
          "storm",
          "weather",
          "nature",
          "dramatic",
          "lightning",
          "thunder",
          "clouds",
          "rain",
          "wind",
          "power",
          "intensity",
          "force",
          "awe-inspiring",
          "captivating",
          "electrifying",
        ],
        imageUrl: "/placeholder.svg",
      },
    ]
  }

  const filteredPhotos = collection.photos.filter((photo) => photo.title.toLowerCase().includes(searchParams?.query?.toLowerCase() || ""))
  const indexOfLastPhoto = currentPage * photosPerPage
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage
  const currentPhotos = filteredPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto)
  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage)
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          <div className="flex items-center mt-4 w-full gap-2">
            <SearchBar placeholder="Search photos..." />
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select an agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Agency</SelectLabel>
                  <SelectItem value="adobe_stock">Adobe Stock</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2" size={20} /> Download CSV
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-6">
          {currentPhotos.map((photo) => (
            <PhotoCard photo={photo} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === currentPage}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

function PhotoCard({ photo }: { photo: any }) {
  const [editing, setEditing] = useState(false)
  const handleEdit = () => {
    setEditing(!editing)
  }

  return (
    editing ? <PhotoCardEdit photo={photo} /> : <PhotoCardView photo={photo} />
  )

  function PhotoCardView({ photo }: { photo: any }) {
    return (
      <div key={photo.id} className="flex items-start gap-4">
        <div className="relative overflow-hidden rounded-lg">
          <Link href={photo.imageUrl} className="absolute inset-0 z-10" prefetch={false}>
            <span className="sr-only">View {photo.title}</span>
          </Link>
          <img
            src="/placeholder.svg"
            alt={photo.title}
            width={400}
            height={400}
            className="w-40 h-40 object-cover group-hover:opacity-50 transition-opacity"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{photo.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="w-4 h-4 hover:bg-transparent text-muted-foreground"
              onClick={() => handleEdit()}
            >
              <Edit className="w-4 h-4" />
              <span className="sr-only">Edit title</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{photo.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {photo.keywords.map((keyword: string, index: number) => (
              <KeywordCard keyword={keyword} photoId={photo.id} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  function PhotoCardEdit({ photo }: { photo: any }) {
    return (
      <div key={photo.id} className="flex items-start gap-4">
        <div className="relative overflow-hidden rounded-lg">
          <Link href={photo.imageUrl} className="absolute inset-0 z-10" prefetch={false}>
            <span className="sr-only">View {photo.title}</span>
          </Link>
          <img
            src="/placeholder.svg"
            alt={photo.title}
            width={400}
            height={400}
            className="w-40 h-40 object-cover group-hover:opacity-50 transition-opacity"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <Input
              type="text"
              value={photo.title}
              className="text-lg font-semibold"
            // onChange={(e) => handleTitleEdit(photo.id, e.target.value)}
            />
            <Button
              variant="default"
              onClick={() => handleEdit()}
            >
              {/* <Edit className="w-4 h-4" /> */}
              Save
              <span className="sr-only">Save edits</span>
            </Button>
          </div>
          <Textarea
            value={photo.description}
            className="text-sm text-muted-foreground mt-2"
          // onChange={(e) => handleDescriptionEdit(photo.id, e.target.value)}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {photo.keywords.map((keyword: string, index: number) => (
              <KeywordCard keyword={keyword} photoId={photo.id} />
            ))}
            <div className="bg-muted text-muted-foreground rounded-md text-xs flex items-center gap-1">
              <Input
                type="text"
                placeholder="Add keyword"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // handleKeywordAdd(photo.id, e.target.value)
                    e.target.value = ""
                  }
                }}
                className="bg-transparent focus:outline-none text-xs px-2 py-1 h-6 w-24"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}


function KeywordCard({
  keyword,
  photoId,
}: {
  keyword: string;
  photoId: number;
}) {
  return (
    <div className="bg-muted text-muted-foreground rounded-md text-xs flex items-center gap-1">
      <span className="px-2 py-1">{keyword}</span>
      <Button
        variant="ghost"
        size="icon"
        className="w-4 h-4 hover:bg-transparent text-muted-foreground"
      // onClick={() => handleKeywordRemove(photoId, keywordId)}
      >
        <XSquareIcon />
        <span className="sr-only">Remove keyword</span>
      </Button>
    </div>
  )
}