interface PageProps{
    params: {
        url: string | string[] | undefined
    }
}

const Page=({params}: PageProps)=> {
    console.log(params);
    return (
        <div className="text-white flex justify-center items-center">Index</div>
    )
}

export default Page;