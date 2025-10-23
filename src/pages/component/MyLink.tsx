import { FunctionComponent, ReactElement } from "react";
import LinkProps from "../../types/LinkProps";



const MyLink: FunctionComponent<LinkProps> = ({label, link, icon, menu=false}) => {

   if(menu == false){
        return <a href={link}>
                    {icon !== undefined && <i className={"fa " + icon + " orange_color"}></i>} <span>{label}</span>
                </a>;
   }else{
        return <li>
            <a href={link}>
                    {icon !== undefined && <i className={"fa " + icon + " orange_color"}></i>} <span>{label}</span>
            </a>
        </li>
   }
}

export default MyLink;