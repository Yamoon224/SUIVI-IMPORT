import { FunctionComponent } from "react";
import BodyProps from "../../types/BodyProps";


const WebPage: FunctionComponent<BodyProps> = ({title, children}) => {

    return(
         <div className="midde_cont">
             <div className="container-fluid">
               <div className="row column_title">
                  <div className="col-md-12">
                     <div className="page_title">
                        <h2>{title}</h2>
                     </div>
                  </div>
               </div>
               {children}
            </div>
                  
           {/* <div className="container-fluid">
               <div className="footer">
                  <p>Copyright © 2025 SO'3G. Tous droits réservés.<br/><br/>
                     Développé par : <a href="">Novexia Group</a>
                  </p>
               </div>
            </div> */}
             {/*<li><a href="widgets.html"><i className="fa fa-clock-o orange_color"></i> <span>Widgets</span></a></li>*/}
         </div>
    );
}

export default WebPage;