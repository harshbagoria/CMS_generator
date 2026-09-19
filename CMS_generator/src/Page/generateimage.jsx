// import React from 'react'
// import { imageresolution } from '../Constant';
// import { useState } from 'react';
// import zod from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { GenerateImage as generateImageApi } from '../services/Image';

// const schema = zod.object({
//     resolution: zod.string().min(1, "Resolution is required"),
//     prompt: zod.string().min(1, "Prompt is required"),

// })

// const GenerateImage = () => {
//     const [generateImage, setgenerateImage] = useState(null);
//     const [Loading , setLoading] = useState(false);
//     const [error , setError]  = useState(null);

//     const {
//         register,
//         handleSubmit,
//         formState: {errors},
//     } = useForm({
//         resolver: zodResolver(schema)
//     })

//     const formhandleSubmit = async (data)=>{
//         console.log("Form submitted", data);
//         setLoading(true);
//         setError(null);

//         try{
//             const res = await generateImageApi(data);
//             console.log("Image generated", res?.data?.image);
//             if(res?.data?.image)
//             setgenerateImage(res?.data?.image);
//         }catch(e){
//             console.log("error Occured", e);
//             setError("An error occured while generating the image");
//         }finally{
//             setLoading(false);  
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-10 px-4">
//             <div className="max-w-2xl mx-auto">
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-800">Generate Image</h1>
//                     <p className="text-gray-500 mt-2">Enter your prompt below to generate an image:</p>
//                 </div>

//                 <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
//                     <form onSubmit={handleSubmit(formhandleSubmit)} className="space-y-5">
//                         <div className="flex flex-col gap-1">
//                             <label htmlFor="resolution" className="text-sm font-medium text-gray-700">
//                                 Resolution:
//                             </label>
//                             <select
//                                 id="resolution"
//                                 className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                           
                           
//                                    {...register("resolution")}>
                                
//                                 {imageresolution.map((option) => (
//                                     <option key={option.value} value={option.value}>
//                                         {option.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         {
//                             errors?.resolution?.message && (
//                                 <p className="text-red-500 text-sm">{errors.resolution.message}</p>
//                             )
//                         }

//                         <div className="flex flex-col gap-1">
//                             <label htmlFor="prompt" className="text-sm font-medium text-gray-700">
//                                 Prompt:
//                             </label>
//                             <textarea
//                                 id="prompt"
//                                 placeholder="Enter your prompt here..."
//                                 rows={4}
//                                 className="border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
//                                 {...register("prompt")} 
//                             />
//                         </div>
//                         {
//                             errors?.prompt?.message && (
//                                 <p className="text-red-500 text-sm">{errors.prompt.message}</p>
//                             )
//                         }

//                         <div>
//                             <button onClick = {handleSubmit(formhandleSubmit)}
//                                 type="submit"
//                                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
//                             >
//                                 Generate
//                             </button>
//                         </div>

                       
//                     </form>
//                     {error && (
//                         <p className="text-red-500 text-sm">{error}</p>
//                     )}
//                     <div className="border-t border-gray-200 pt-6">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Image is here</h2>

//                         {generateImage ? (
//                             <div className="space-y-4">
//                                 <div className="rounded-lg overflow-hidden border border-gray-200">
//                                     <img
//                                         src={generateImage}
//                                         alt="Generated"
//                                         className="w-full h-auto object-cover"
//                                     />
//                                 </div>

//                                 <div className="flex items-center gap-3">
//                                     <a
//                                         href={generateImage}
//                                         download="generated_image.png"
//                                         className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
//                                     >
//                                         Download Image
//                                     </a>
                                   
//                                 </div>
//                                  <button onClick={() => setgenerateImage(null)} className="text-blue-600 hover:underline">
//                                         Generate Again
//                                     </button>
//                             </div>
//                         ) : (
//                             <div className="">
//                                 <p className="text-gray-400">No image generated yet.</p>
//                             </div>
//                         )}
//                     </div>
                
//             </div>
//         </div>
//         </div>
//     );
// };

// export default GenerateImage




import React from 'react'
import { imageresolution } from '../Constant';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { useState } from 'react';
import { generatedImage } from '../services/Image';

const schema = zod.object({
    resolution: zod.string().min(1, "Resolution is required"),
    prompt: zod.string().min(1, "Prompt is required"),
});

const GenerateImage = () => {
    const [generateImage, setGenerateImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { resolution: imageresolution?.[0]?.value ?? "" },
    });

    const formHandleSubmit = async (data) => {
        setLoading(true);
        setError(null);
        setGenerateImage(null);

        try {
            const res = await generatedImage(data);
            if (res?.data?.image) {
                console.log("Image generated ", res.data.image);
                setGenerateImage(res.data.image);
            } else {
                setError("No image was returned. Please try again.");
            }
        } catch (e) {
            console.log("Error occurred", e);
            setError("Something went wrong while generating the image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                        AI Image Generator
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm sm:text-base">
                        Describe what you want to see, and let AI bring it to life.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5 p-6 sm:p-8 space-y-6">
                    <form onSubmit={handleSubmit(formHandleSubmit)} className="space-y-5" noValidate>
                        {/* Resolution */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="resolution" className="text-sm font-semibold text-slate-700">
                                Resolution
                            </label>
                            <select
                                id="resolution"
                                disabled={loading}
                                className="border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 bg-white
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                           disabled:bg-slate-100 disabled:cursor-not-allowed
                                           transition-colors"
                                {...register("resolution")}
                            >
                                {imageresolution.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors?.resolution?.message && (
                                <p className="text-red-500 text-xs mt-0.5">{errors.resolution.message}</p>
                            )}
                        </div>

                        {/* Prompt */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="prompt" className="text-sm font-semibold text-slate-700">
                                Prompt
                            </label>
                            <textarea
                                id="prompt"
                                placeholder="e.g. A cyberpunk city street at night, neon lights, rain-slicked pavement..."
                                rows={4}
                                disabled={loading}
                                className="border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 resize-none
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                           disabled:bg-slate-100 disabled:cursor-not-allowed
                                           transition-colors placeholder:text-slate-400"
                                {...register("prompt")}
                            />
                            {errors?.prompt?.message && (
                                <p className="text-red-500 text-xs mt-0.5">{errors.prompt.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700
                                       active:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed
                                       text-white font-medium py-2.5 rounded-lg transition-colors
                                       shadow-sm shadow-indigo-200"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate"
                            )}
                        </button>
                    </form>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2.5">
                            <span className="mt-0.5">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Result */}
                    <div className="border-t border-slate-200 pt-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Result</h2>

                        {loading ? (
                            <div className="rounded-lg border border-slate-200 aspect-square bg-slate-100 animate-pulse flex items-center justify-center">
                                <span className="text-slate-400 text-sm">Generating your image...</span>
                            </div>
                        ) : generateImage ? (
                            <div className="space-y-4">
                                <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                    <img
                                        src={generateImage}
                                        alt="Generated"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <a
                                        href={generateImage}
                                        download="generated_image.png"
                                        className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white
                                                   font-medium py-2.5 px-4 rounded-lg transition-colors text-sm
                                                   shadow-sm shadow-emerald-200"
                                    >
                                        Download Image
                                    </a>
                                    <a
                                        href="#"
                                        onClick={() => setGenerateImage(null)}
                                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline"
                                    >
                                        Generate Again
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-slate-300 aspect-square flex items-center justify-center">
                                <p className="text-slate-400 text-sm">No image generated yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateImage;

