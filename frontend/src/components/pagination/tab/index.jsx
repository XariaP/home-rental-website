import { Link } from "react-router-dom";

export default function Tab({num, active, link}) {
    const id = "search-page" + num;
    const classes = () => {
        var cl = "page-link";
        if (active){
            cl += " active";
        }
        // console.log(link);
        return cl;
    }

    const fulllink = () => {
        // console.log(link + num);
        return link + num;
    }
    
    // const handleClick = () => {
        
    // }

    // useEffect(() => {
    //     window.scrollTo(0,0);
    // })

    return <>
        {/* <li className="page-item" role="presentation"> */}
            {/* <Link to={fulllink()} className={classes()} id={id} type="button" onClick={handleClick()}>{num}</Link> */}
            <Link to={fulllink()} className={classes()} id={id} type="button">{num}</Link>
        {/* </li> */}
    </>;
}
