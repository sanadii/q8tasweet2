import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { getElections, getCategories } from "store/actions";
import { electionSelector, categorySelector } from 'Selectors';

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

const ElectionGrid = () => {
  const dispatch = useDispatch();
  document.title = "الرئيسية - كويت تصويت";

  const { elections, isElectionSuccess } = useSelector(electionSelector);
  const { categories } = useSelector(categorySelector);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!elections.length) {
      dispatch(getElections('public'));
      dispatch(getCategories());
    }
  }, [dispatch, elections.length, isElectionSuccess]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Card>
            <CardHeader className="border-0">
              <div className="d-lg-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">الإنتخابات</h5>
                </div>
                <div className="flex-shrink-0 mt-4 mt-lg-0">
                  <ul className="nav nav-pills filter-btns" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('All')}
                        className={selectedCategory === "All" ? "nav-link fw-medium active" : "nav-link fw-medium"}
                      >
                        الكل
                      </button>
                    </li>
                    {categories.map(category => (
                      <li key={category.id} className="nav-item" role="presentation">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(category.id)}
                          className={selectedCategory === category.id ? "nav-link fw-medium active" : "nav-link fw-medium"}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardHeader>

          </Card>
          <Row>
            {elections.filter(({ category }) => selectedCategory === 'All' || category === selectedCategory).map((item, key) => (
              <Col xxl={2} lg={3} md={4} key={key}>
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

        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionGrid;
