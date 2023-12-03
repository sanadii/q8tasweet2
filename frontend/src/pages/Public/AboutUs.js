import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

// Import Images
import img1 from "assets/images/landing/features/img-1.png";
import img2 from "assets/images/landing/features/img-2.png";
import img3 from "assets/images/landing/features/img-3.png";

const AboutUs = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <section className="section bg-light py-5" id="features">
                    <Container>

                        <Row className="justify-content-center">
                            <Col lg={8}>
                                <div className="text-center mb-5">
                                    <h1 className="mb-3 ff-secondary fw-semibold lh-base">من نحن</h1>
                                    <p className="text-muted">نحن استوديو تصميم ويب رقمي نقدم تصاميم وحلول حديثة وجذابة على الإنترنت.</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="g-3">
                            <Col lg={6}>
                                <div className="d-flex p-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-group-line fs-36"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-18">ملخص</h5>
                                        <p className="text-muted my-3 ff-secondary">
                                            نقدم ملخصًا لمعلومات الانتخابات بما في ذلك عدد المرشحين الإجمالي واللجان وإحصائيات الحملة.
                                            كما نوفر روابط أو أزرار للانتقال إلى الأقسام التفصيلية إذا كان العملاء يرغبون في استكشاف كل فئة بمزيد من التفصيل.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div className="d-flex p-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-check-line fs-36"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-18">المرشحين</h5>
                                        <p className="text-muted my-3 ff-secondary">
                                            يمكن للمستخدمين إضافة / تعديل / عرض تفاصيل المرشحين هنا. نقوم بعرض قائمة بالمرشحين مع نتائجهم النهائية.
                                            نوفر أيضًا إمكانية تنفيذ إجراءات مثل التحرير والحذف لكل مرشح.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div className="d-flex p-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-flag-line fs-36"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-18">اللجان</h5>
                                        <p className="text-muted my-3 ff-secondary">
                                            نسمح بإضافة وتحرير وحذف اللجان. إذا كانت هناك لجنة واحدة فقط (المجموع)، سنبسط الواجهة لتعكس هذه البساطة.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div className="d-flex p-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-bank-line fs-36"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-18">الحملات الإنتخابية</h5>
                                        <p className="text-muted my-3 ff-secondary">
                                            مخصصة لإنشاء وإدارة ورصد الحملات الانتخابية. يجب أن تدير هنا جميع الأنشطة والحالات المتعلقة بالحملات.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div className="d-flex p-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-trophy-line fs-36"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-18">النتائج</h5>
                                        <p className="text-muted my-3 ff-secondary">
                                            سنغير اسم "النتائج الكاملة" إلى "النتائج" للبساطة. استخدم هذا الجزء لعرض النتائج النهائية وتحرير نتائج اللجنة.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div className="d-flex p-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-user-settings-line fs-36"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-18">عمليات المستخدم</h5>
                                        <p className="text-muted my-3 ff-secondary">
                                            يتم الاحتفاظ به كما هو، ويدير الإجراءات والمعلومات المتعلقة بالمستخدمين.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div className="d-flex p-3">
                                    <div className="avatar-sm icon-effect">
                                        <div className="avatar-title bg-transparent text-success rounded-circle">
                                            <i className="ri-settings-3-line fs-36"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-18">إدارة الفحملات الانتخابية</h5>
                                        <p className="text-muted my-3 ff-secondary">
                                            يتم الاحتفاظ به كما هو، ويتم فيه تحرير تفاصيل الانتخابات والإعدادات والتكوينات المتعلقة بالانتخابات.
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="section bg-light py-5" id="features">
                    <Container>
                        <Row className="align-items-center gy-4">
                            <Col lg={6} sm={7} className="mx-auto">
                                <div>
                                    <img src={img1} alt="" className="img-fluid mx-auto" />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="text-muted">
                                    <div className="avatar-sm icon-effect mb-4">
                                        <div className="avatar-title bg-transparent rounded-circle text-success h1">
                                            <i className="ri-collage-line fs-36"></i>
                                        </div>
                                    </div>
                                    <h3 className="mb-3 fs-20">مجموعة كبيرة من الودجت</h3>
                                    <p className="mb-4 ff-secondary fs-16">تخصص ودجت المجموعة في عرض العديد من العناصر من نفس النوع، مثل مجموعة من الصور من مقالات التطبيق الإخباري أو مجموعة من الرسائل من التطبيقات التواصل.</p>

                                    <Row className="pt-3">
                                        <Col className="col-3">
                                            <div className="text-center">
                                                <h4>5</h4>
                                                <p>لوحات القيادة</p>
                                            </div>
                                        </Col>
                                        <Col className="col-3">
                                            <div className="text-center">
                                                <h4>150+</h4>
                                                <p>صفحات</p>
                                            </div>
                                        </Col>
                                        <Col className="col-4">
                                            <div className="text-center">
                                                <h4>7+</h4>
                                                <p>تطبيقات وظيفية</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                <section className="py-5 bg-primary position-relative">
                    <div className="bg-overlay bg-overlay-pattern opacity-50"></div>
                    <Container>
                        <Row className="align-items-center gy-4">
                            <Col className="col-sm">
                                <div>
                                    <h4 className="text-white mb-0 fw-semibold">قم ببناء تطبيق الويب/الخدمات السحابية الخاصة بك مع لوحة تحكم Velzon</h4>
                                </div>
                            </Col>
                            <Col className="col-sm-auto">
                                <div>
                                    <Link to="/1.envato.market/velzon-admin" target="_blank" className="btn bg-gradient btn-danger"><i className="ri-shopping-cart-2-line align-middle me-1"></i> اشترِ الآن</Link>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                <section className="section">
                    <Container>
                        <Row className="align-items-center gy-4">
                            <Col lg={6} className="order-2 order-lg-1">
                                <div className="text-muted">
                                    <h5 className="fs-12 text-uppercase text-success">التصميم</h5>
                                    <h4 className="mb-3">لوحات تحكم جيدة التصميم</h4>
                                    <p className="mb-4 ff-secondary">لوحات التحكم عالية الجودة (Quality Dashboards) هي تطبيق ويب قائم على الشروط والإجراءات المحددة للتقارير عالية الجودة وإدارة السكان المدمج في السجل الصحي الإلكتروني (EHR).</p>

                                    <Row>
                                        <Col sm={5}>
                                            <div className="vstack gap-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <div className="avatar-xs icon-effect">
                                                            <div
                                                                className="avatar-title bg-transparent text-success rounded-circle h2">
                                                                <i className="ri-check-fill"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="fs-14 mb-0">التجارة الإلكترونية</h5>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <div className="avatar-xs icon-effect">
                                                            <div
                                                                className="avatar-title bg-transparent text-success rounded-circle h2">
                                                                <i className="ri-check-fill"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="fs-14 mb-0">التحليلات</h5>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <div className="avatar-xs icon-effect">
                                                            <div
                                                                className="avatar-title bg-transparent text-success rounded-circle h2">
                                                                <i className="ri-check-fill"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="fs-14 mb-0">إدارة العلاقات مع العملاء</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={5}>
                                            <div className="vstack gap-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <div className="avatar-xs icon-effect">
                                                            <div
                                                                className="avatar-title bg-transparent text-success rounded-circle h2">
                                                                <i className="ri-check-fill"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="fs-14 mb-0">عملة مشفرة</h5>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <div className="avatar-xs icon-effect">
                                                            <div
                                                                className="avatar-title bg-transparent text-success rounded-circle h2">
                                                                <i className="ri-check-fill"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="fs-14 mb-0">المشاريع</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="mt-4">
                                        <Link to="/index" className="btn btn-primary">اعرف المزيد <i className="ri-arrow-right-line align-middle ms-1"></i></Link>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={6} sm={7} className="col-10 ms-auto order-1 order-lg-2">
                                <div>
                                    <img src={img2} alt="" className="img-fluid" />
                                </div>
                            </Col>
                        </Row>

                        <Row className="align-items-center mt-5 pt-lg-5 gy-4">
                            <Col lg={6} sm={7} className="col-10 mx-auto">
                                <div>
                                    <img src={img3} alt="" className="img-fluid" />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="text-muted ps-lg-5">
                                    <h5 className="fs-12 text-uppercase text-success">البنية</h5>
                                    <h4 className="mb-3">موثقة بشكل جيد</h4>
                                    <p className="mb-4">تستخدم لوصف شيء معروف أو معروف بأنه صحيح لأن هناك العديد من الوثائق التي تصفه، تثبته، إلخ.</p>

                                    <div className="vstack gap-2">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0 me-2">
                                                <div className="avatar-xs icon-effect">
                                                    <div className="avatar-title bg-transparent text-success rounded-circle h2">
                                                        <i className="ri-check-fill"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0">محتوى ديناميكي</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0 me-2">
                                                <div className="avatar-xs icon-effect">
                                                    <div className="avatar-title bg-transparent text-success rounded-circle h2">
                                                        <i className="ri-check-fill"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0">معلومات إعداد الإضافات.</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0 me-2">
                                                <div className="avatar-xs icon-effect">
                                                    <div className="avatar-title bg-transparent text-success rounded-circle h2">
                                                        <i className="ri-check-fill"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0">معلومات تخصيص الأنماط</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div>
        </React.Fragment>
    );
};

export default AboutUs;
