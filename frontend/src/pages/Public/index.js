import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardBody, Col, Container, Row } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { getCandidates, getElections } from "../../store/actions";
import Countdown from "react-countdown";
import { candidateSelector, electionSelector } from 'selectors';
import { useProfile } from "shared/hooks";

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

const Public = () => {
    const dispatch = useDispatch();
    const { token } = useProfile();
    const navigate = useNavigate();

    document.title = "الرئيسية - كويت تصويت";
    const [displayCategory, setCategory] = useState("All");
    const { candidates, isCandidateSuccess, error } = useSelector(candidateSelector);
    const [election, setElection] = useState([]);
    const [candidateList, setCandidateList] = useState([]);

    // Candidate Data
    useEffect(() => {
        if (!isCandidateSuccess) {
            dispatch(getCandidates());
        }
    }, [dispatch, isCandidateSuccess]);

    useEffect(() => {
        // Filter candidates with status "publish"
        const publishedCandidates = candidates.filter((item) => item.status === 1);
        setCandidateList(publishedCandidates);
    }, [candidates]);

    const { elections, recentElections, futureElections, isElectionSuccess } = useSelector(electionSelector);

    // Election Data
    useEffect(() => {
        if (recentElections && recentElections !== 0) {
            dispatch(getElections('index'));
        }
    }, [dispatch, isElectionSuccess]);

    const renderer = ({ days, hours, minutes, completed }) => {
        if (completed) {
            // Render a completed state
            return <span>You are good to go!</span>;
        } else {
            return (
                <>
                    <h5 id="auction-time-1" className="mb-0 text-white">{days} يوم : {hours} ساعة : {minutes} دقيقة</h5>
                </>
            );
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    const randomCandidates = shuffleArray([...candidates]).slice(0, 5);


    // if (token) {
    //     navigate('/dashboard')
    // }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xxl={9}>
                            <Card>
                                <CardHeader className="border-0">
                                    <div className="d-lg-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">الإنتخابات</h5>
                                        </div>
                                        <div className="flex-shrink-0 mt-4 mt-lg-0">
                                            <Link className="text-muted" to="/elections">
                                                مشاهدة الكل <i className="ri-arrow-right-line align-bottom"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                            <Row>

                                {(recentElections.filter(({ category }) => displayCategory === category || displayCategory === "All")).map((item, key) => (<Col xxl={3} lg={4} md={6} className="product-item upto-15" key={key}>
                                    <Card className="explore-box card-animate">
                                        <div className="position-relative rounded overflow-hidden">
                                            <Link to={`/elections/${item.slug}`}>
                                                <img src={`${MEDIA_URL}${item.image}`} alt="" className="explore-img w-100 h-100" />
                                            </Link>
                                        </div>
                                        <CardBody>
                                            <Link to={`/elections/${item.slug}`}>
                                                <h5 className="text-success">{item.name} </h5>
                                            </Link>
                                            <h6 className="fs-16 mb-3">
                                                <p className="text-muted">
                                                    {item.dueDate} <br />
                                                    {item.categoryName}
                                                </p>
                                            </h6>
                                        </CardBody>
                                    </Card>
                                </Col>
                                ))}
                            </Row>
                        </Col>
                        <Col xxl={3}>
                            <Card>
                                <CardHeader className="d-flex align-items-center">
                                    <h6 className="card-title mb-0 flex-grow-1">إنتخابات قادمة</h6>
                                    {futureElections.length > 10 &&
                                        <Link className="text-muted" to="/elections">
                                            مشاهدة الكل <i className="ri-arrow-right-line align-bottom"></i>
                                        </Link>
                                    }
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive table-card">
                                        <table className="table table-borderless align-middle">
                                            <tbody>
                                                {futureElections.map((item, key) => (
                                                    <tr key={key}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <img src={`${MEDIA_URL}${item.image}`} alt="" className="avatar-sm object-cover rounded-circle" />
                                                                <div className="ms-2">
                                                                    <Link to="#"><h6 className="fs-15 mb-1">{item.name}</h6></Link>
                                                                    <p className="mb-0 text-muted strong">{item.categoryName}<span> - {item.dueDate}</span></p>

                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardBody>
                            </Card>
                            {/* <Card>
                                <CardHeader className="d-flex align-items-center">
                                    <h6 className="card-title mb-0 flex-grow-1">أعضاء مجالس</h6>
                                    <Link className="text-muted" to="#">
                                        مشاهدة الكل <i className="ri-arrow-right-line align-bottom"></i>
                                    </Link>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive table-card">
                                        <table className="table table-borderless align-middle">
                                            <tbody>
                                                {randomCandidates.map((item, key) => (
                                                    <tr key={key}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <img src={`${MEDIA_URL}${item.image}`} alt="" className="avatar-sm object-cover rounded-circle" />
                                                                <div className="ms-2">
                                                                    <Link to="#"><h6 className="fs-15 mb-1">{item.name}</h6></Link>
                                                                    <p className="mb-0 text-muted">{item.name} election</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button className={item.name ? "btn btn-sm btn-success" : "btn btn-sm btn-soft-success"}>
                                                                {item.isFollow ? "Follow" : "Unfollow"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardBody>
                            </Card> */}
                            {/* <Card>
                                <CardHeader className="d-flex align-items-center">
                                    <h6 className="card-title mb-0 flex-grow-1">مرشحين سابقين</h6>
                                    <Link className="text-muted" to="/apps-nft-item-details">
                                        مشاهدة الكل <i className="ri-arrow-right-line align-bottom"></i>
                                    </Link>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive table-card">
                                        <table className="table table-borderless align-middle">
                                            <tbody>
                                                {randomCandidates.map((item, key) => (<tr key={key}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img src={`${MEDIA_URL}${item.image}`} alt="" className="avatar-sm object-cover rounded-circle" />
                                                            <div className="ms-2">
                                                                <Link to="#"><h6 className="fs-15 mb-1">{item.name}</h6></Link>
                                                                <p className="mb-0 text-muted">{item.name} election</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><button className={item.name ? "btn btn-sm btn-success" : "btn btn-sm btn-soft-success"}>{item.isFollow ? "Follow" : "Unfollow"}</button></td>
                                                </tr>))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardBody>
                            </Card> */}
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Public;
