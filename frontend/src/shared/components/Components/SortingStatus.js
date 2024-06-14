import { Spinner } from "reactstrap";

// TODO
<<<<<<< HEAD
// تم اغلاق الصناديق
=======
// تم اغلق الصناديق
>>>>>>> sanad
// بدأ عملية الفرز
// انتهاء عملية الفرز
// بانتظار النتائج النهائية الرسمية
const SortingStatus = () => {

    return (
        <span>
            <Spinner size="sm" color="success" className="flex-shrink-0"> الفرز... </Spinner>
            <span className="flex-grow-1 ms-2 text-success">
                عملية الفرز جارية...
            </span>
        </span>
    )
}

export default SortingStatus;
