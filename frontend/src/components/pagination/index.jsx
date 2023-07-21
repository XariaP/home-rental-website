import { Link } from "react-router-dom";
import Tab from "./tab";

export default function Pagination({total, pg, link}){

    const allTabs = () => {
        if (pg > total)
            return <></>;
            
        const list = new Array(parseInt(total));
        var count = 1;

        while (count != total + 1){
            list[count] = count;
            count++;
        }
        return <>
            {list.map( page => {
                var act = (page == pg);
                return <Tab key={page} num={page} active={act} link={link}/>
            })}
        </>;
    }

    return <>
        <div className="page-nav bg-light">
            <nav aria-label="Page navigation example" className="mt-3">
            <ul className="mb-3 pagination justify-content-center" id="search-tab" role="tablist">
                {/* <li className="page-item disabled" role="presentation">
                    <button className="page-link" id="prev" type="button">Previous</button>
                </li> */}
                
                {allTabs()}

                {/* <li className="page-item" role="presentation">
                    <button className="page-link" id="next" type="button">Next</button>
                </li> */}
            </ul>
            </nav>
        </div>
    </>;
}