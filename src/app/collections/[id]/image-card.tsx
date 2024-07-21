import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import React from "react"
import Keywords from "./keywords"
import { createClient } from "@/utils/supabase/server"

export default async function ImageCard(
  {
    image,
  }: {
    image: {
      collection_id: number;
      description: string;
      file_name: string;
      id: number;
      title: string;
    }
  }
) {
  const supabase = createClient()
  const { data: keywords, error } = await supabase
    .from("keywords")
    .select()
    .eq("image_id", image.id)
  if (error) {
    console.error(error)
  }

  // const [editing, setEditing] = React.useState(false)
  // const handleEdit = () => {
  //   setEditing(!editing)
  // }

  return (
    // editing ?
    //   <PhotoCardForm image={image} />
    //   :
    <PhotoCardView image={image} keywords={keywords} />
  )
}

// function PhotoCardForm({ image, handleEdit }: { image: any, handleEdit: () => void }) {
//   return (
//     <div key={image.id} className="flex items-start gap-4">
//       <div className="relative overflow-hidden rounded-lg">
//         <Link href={image.imageUrl} className="absolute inset-0 z-10" prefetch={false}>
//           <span className="sr-only">View {image.title}</span>
//         </Link>
//         <img
//           src="/placeholder.svg"
//           alt={image.title}
//           width={400}
//           height={400}
//           className="w-40 h-40 object-cover group-hover:opacity-50 transition-opacity"
//         />
//       </div>
//       <form className="flex-1">
//         <div className="flex items-center justify-between gap-3">
//           <Input
//             type="text"
//             value={image.title}
//             className="text-lg font-semibold"
//           // onChange={(e) => handleTitleEdit(image.id, e.target.value)}
//           />
//           <Button
//             variant="default"
//             onClick={() => handleEdit()}
//           >
//             {/* <Edit className="w-4 h-4" /> */}
//             Save
//             <span className="sr-only">Save edits</span>
//           </Button>
//         </div>
//         <Textarea
//           value={image.description}
//           className="text-sm text-muted-foreground mt-2"
//         // onChange={(e) => handleDescriptionEdit(image.id, e.target.value)}
//         />
//         <KeywordGroup imageId={image.id} keywords={image.keywords} />
//       </form>
//     </div>
//   )
// }

function PhotoCardView(
  {
    image,
    keywords
  }: {
    image: {
      collection_id: number;
      description: string;
      file_name: string;
      id: number;
      title: string;
    },
    keywords: {
      created_at: string;
      id: number;
      image_id: number;
      keyword: string;
      user_id: string;
    }[] | null
    // handleEdit: () => void
  }
) {
  return (
    <div key={image.id} className="flex items-start gap-4">
      <div className="relative overflow-hidden rounded-lg">
        {/* <Link href={image.imageUrl} className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">View {image.title}</span>
        </Link> */}
        <img
          src="/placeholder.svg"
          alt={image.title}
          width={400}
          height={400}
          className="w-40 h-40 object-cover group-hover:opacity-50 transition-opacity"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{image.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="w-4 h-4 hover:bg-transparent text-muted-foreground"
          // onClick={() => handleEdit()}
          >
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit title</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{image.description}</p>
        <Keywords imageId={image.id} keywords={keywords} />
      </div>
    </div>
  )
}