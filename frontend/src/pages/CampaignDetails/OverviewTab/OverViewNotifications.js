import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TabContent, Card, CardHeader, CardBody, Col, Row, Accordion, Button } from "reactstrap";

import { campaignSelector } from 'selectors';
import { messageTypes } from "shared/constants";
import { useWebSocketContext } from 'shared/utils';

const OverviewNotifications = () => {
  const { messageHistory } = useWebSocketContext();
  const notificationHistory = messageHistory.notification || [];
  const { campaignNotifications } = useSelector(campaignSelector);

  // Combine notificationHistory with campaignNotifications
  const combinedNotifications = [...notificationHistory, ...campaignNotifications];

  // State to manage displayed notifications
  const [displayedNotifications, setDisplayedNotifications] = useState(combinedNotifications.slice(-5));

  const getNotificationDetails = (type) => {
    return messageTypes.find(nt => nt.value === type) || {};
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${day}/${month}/${year} @${hours}:${minutes}${ampm}`;
  };

  const loadMoreNotifications = () => {
    // Load 5 more notifications
    const totalNotifications = combinedNotifications.length;
    const displayedCount = displayedNotifications.length;
    const nextNotifications = combinedNotifications.slice(Math.max(totalNotifications - displayedCount - 5, 0), totalNotifications - displayedCount);
    setDisplayedNotifications([...displayedNotifications, ...nextNotifications]);
  };


  const renderNotificationMessages = () => {
    return displayedNotifications.map((msg, idx) => {
      const notificationDetails = getNotificationDetails(msg.messageType);

      return (
        <div className="accordion-item border-0" key={idx}>
          <div className="accordion-header">
            <button className="accordion-button p-2 shadow-none" type="button">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className={`${notificationDetails.iconClass} p-2 rounded-circle text-${notificationDetails.color} bg-soft-${notificationDetails.color}`}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="fs-14 mb-1">{msg.createdByName}</h6>
                  <p className="text-muted">{msg.message}</p>
                  <small>{formatDate(msg.createdAt)}</small>
                </div>
              </div>
            </button>
          </div>
        </div>
      );
    });
  };


  return (
    <Row>
      <Col lg={12}>
        <Card>
          <CardHeader className="align-items-center d-flex">
            <h5 className="card-title mb-3"><strong>اشعارات</strong></h5>
          </CardHeader>
          <CardBody>
            <TabContent className="text-muted">
              <div className="profile-timeline">
                <Accordion className="accordion accordion-flush" id="todayExample">
                  {renderNotificationMessages()}
                </Accordion>
                {displayedNotifications.length < combinedNotifications.length && (
                  <Button color="primary" onClick={loadMoreNotifications}>Load More</Button>
                )}
              </div>
            </TabContent>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};


export default OverviewNotifications;
