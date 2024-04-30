export default function Footer(){
    return(
        <div className="footer">
            <div>
                <p style={{margin:0}}>&copy; {new Date().getFullYear()} Все права защищены</p>  
            </div>
        </div>
    );
}