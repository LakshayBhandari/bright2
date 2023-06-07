const { useLocation, useNavigate } = require("react-router-dom");

const browseLibraryLinks = [
    {
        id: 1,
        title: 'Must Read',
        to: '/must-read',
    },
    {
        id: 2,
        title: 'Browse Library',
        to: '/browse-library',
    },
    {
        id: 3, 
        title: 'Most Popular',
        to: '/most-popular',
    }
];

const BrowseLibraryLinks = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="browse-library">
            <div className='filters filters-square'>
                <div className='filter-list'>
                    {browseLibraryLinks.map(link => {
                        return (
                            <div 
                                key={link.id}
                                className={`filter ${link.to === location.pathname ? 'selected-filter' : ''}`} 
                                onClick={() => navigate(link.to)}
                            >
                                <h3>{link.title}</h3>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BrowseLibraryLinks;