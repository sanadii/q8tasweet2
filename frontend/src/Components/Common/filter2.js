

const ElectionCategoryFilters = ({ setElectionList }) => {
    const elections = useSelector((state) => state.Elections.elections);
    const categories = useSelector((state) => state.Categories.categories);
    console.log("Election List:", elections);
    console.log("Category List:", categories);

    const [activeTab, setActiveTab] = useState("0");
    const [filteredElectionList, setFilteredElectionList] = useState([]);
    console.log("activeTab:", activeTab);
    console.log("filteredElectionList:", filteredElectionList);

    const filterByCategory = (categoryId) => {
        if (categoryId) {
            setElectionList(
                elections.filter((election) => election.category === categoryId)
            );
        } else {
            setElectionList(elections);
        }
    };

    console.log("Initial election list:", electionList);

    const toggleTab = (tab, categoryId) => {
        console.log(`Attempting to switch to tab ${tab} with category ID: ${categoryId}`);
        if (activeTab !== tab) {
            setActiveTab(tab);
            let filtered = categoryId === "all"
                ? electionList
                : electionList.filter((e) => {
                    console.log(`Checking election with category: ${e.category}`);
                    return e.category === String(categoryId);
                });

            console.log("Category to filter:", categoryId);
            console.log("Filtered results:", filtered);

            setElectionList(filtered); // Update electionList with the filtered list
        }
    };

    return (
        <div className="col">
            <Nav className="nav-tabs-custom card-header-tabs border-bottom-0" role="tablist">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === "0" }, "fw-semibold")}
                        onClick={() => {
                            console.log("Tab 'All' clicked.");
                            toggleTab("0", "all");
                        }}
                        href="#"
                    >
                        All
                    </NavLink>
                </NavItem>
                {categoryList.map((category, index) => (
                    <NavItem key={category.id}>
                        <NavLink
                            className={classnames({ active: activeTab === String(index + 1) }, "fw-semibold")}
                            onClick={() => {
                                console.log(`Tab with category ID: ${category.id} clicked.`);
                                toggleTab(String(index + 1), category.id);
                            }}
                            href="#"
                        >
                            {category.name}
                            <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                                12 {/* Replace with actual badge count */}
                            </span>
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
        </div>
    );
};



const ElectionCategoryFilters = ({ setElectionList }) => {
    const elections = useSelector((state) => state.Elections.elections);
    const categories = useSelector((state) => state.Categories.categories);
    console.log("Election List:", elections);
    console.log("Category List:", categories);

    const [activeTab, setActiveTab] = useState("0");
    const [filteredElectionList, setFilteredElectionList] = useState([]);
    console.log("activeTab:", activeTab);
    console.log("filteredElectionList:", filteredElectionList);

    const filterByCategory = (categoryId) => {
        if (categoryId) {
            setElectionList(
                elections.filter((election) => election.category === categoryId)
            );
        } else {
            setElectionList(elections);
        }
    };

    console.log("Initial election list:", electionList);

    const toggleTab = (tab, categoryId) => {
        console.log(`Attempting to switch to tab ${tab} with category ID: ${categoryId}`);
        if (activeTab !== tab) {
            setActiveTab(tab);
            let filtered = categoryId === "all"
                ? electionList
                : electionList.filter((e) => {
                    console.log(`Checking election with category: ${e.category}`);
                    return e.category === String(categoryId);
                });

            console.log("Category to filter:", categoryId);
            console.log("Filtered results:", filtered);

            setElectionList(filtered); // Update electionList with the filtered list
        }
    };

    return (
        <div className="col">
            <Nav className="nav-tabs-custom card-header-tabs border-bottom-0" role="tablist">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === "0" }, "fw-semibold")}
                        onClick={() => {
                            console.log("Tab 'All' clicked.");
                            toggleTab("0", "all");
                        }}
                        href="#"
                    >
                        All
                    </NavLink>
                </NavItem>
                {categoryList.map((category, index) => (
                    <NavItem key={category.id}>
                        <NavLink
                            className={classnames({ active: activeTab === String(index + 1) }, "fw-semibold")}
                            onClick={() => {
                                console.log(`Tab with category ID: ${category.id} clicked.`);
                                toggleTab(String(index + 1), category.id);
                            }}
                            href="#"
                        >
                            {category.name}
                            <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                                12 {/* Replace with actual badge count */}
                            </span>
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
        </div>
    );
};