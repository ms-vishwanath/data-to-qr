import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Button
} from "../components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import {
  Textarea
} from "../components/ui/textarea"
import { useRef, useState } from "react"
import Spinner from "../components/ui/spinner"
import QRCode from "react-qr-code";

const formSchema = z.object({
  data: z.string().min(1, "Required").max(500)
});

export default function GenerateQr() {
  const [loading, setloading] = useState<any>(false)
  const [qrstatus, setqrstatus] = useState<any>("form")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: ""
    }
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateQRCode = async (text: string) => {
    if (!canvasRef.current || !text) return;
    try {

    } catch (err) {
      console.error(err);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setloading(true)
    setqrstatus("generating")
    try {
      await generateQRCode(values.data)
      setqrstatus("generated")
    } catch (error) {
      console.log("Form submission error", error);
    }
    finally {
      setloading(false)
    }
  }
  const svgRef = useRef<SVGSVGElement | null | any>(null);

  const downloadPNG = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }
      ctx.fillStyle = "white"; // optional, set background white
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.onerror = (e) => {
      console.error("Failed to load SVG image for conversion", e);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl text-center font-bold">Data to QR</h1>
      <Form {...form}>
        {
          qrstatus === "form" &&
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl  w-11/12 lg:min-w-lg mx-auto">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Type here..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter a data or url which will be mapped with a qr code</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={loading} type="submit" className="w-full">Submit</Button>
            </div>
          </form>
        }
        {
          qrstatus === "generating" &&
          <div className="mx-auto w-full">
            <Spinner />
          </div>
        }
        {
          qrstatus === "generated" &&
          <div className="space-y-6">
            <div className="bg-white inline-block" style={{ maxWidth: 256 }}>
              <QRCode value={form.watch("data")} ref={svgRef} />
            </div>
            <div className="flex justify-center gap-4 lg:flex-row flex-col ">
              <Button className="" onClick={downloadPNG}>
                Download as PNG
              </Button>
              <Button variant={"destructive"} className="sm:w-full lg:w-auto" onClick={() => {
                form.reset()
                setqrstatus("form")
              }}>
                Reset
              </Button>
            </div>
          </div>
        }
      </Form>
    </div>
  )
}