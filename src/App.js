import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import customersData from './data/customers.json';
import bookmarksData from './data/bookmarks.json';
import notesData from './data/notes.json';

const moveBackground = keyframes`
  0% {
    background-position: 0% 50%;
    transform: scale(1);
  }
  25% {
    transform: scale(1.05);
  }
  50% {
    background-position: 100% 50%;
    transform: scale(1);
  }
  75% {
    transform: scale(1.05);
  }
  100% {
    background-position: 0% 50%;
    transform: scale(1);
  }
`;

const shine = keyframes`
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.4;
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;

  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 33vh;
    background: linear-gradient(
      45deg, 
      #FF6B6B,
      #4ECDC4,
      #45B7D1,
      #6c5ce7,
      #FF6B6B
    );
    background-size: 300% 300%;
    animation: ${moveBackground} 8s ease infinite;
    z-index: -1;
  }

  &:after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 33vh;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: ${shine} 4s linear infinite;
    z-index: -1;
  }
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const CustomerCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  h2 {
    color: #2c3e50;
    margin: 0 0 15px 0;
  }

  p {
    color: #666;
    margin: 8px 0;
    font-size: 1.1em;
  }

  .documentation {
    color: #2980b9;
    text-decoration: none;
    display: inline-block;
    margin-top: 10px;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .restart {
    background: #f7f9fc;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.9em;
    color: #34495e;
    margin: 10px 0;
    border: 1px solid #e1e8ed;
    display: flex;
    align-items: center;
    gap: 8px;

    &:before {
      content: '🔄';
      font-size: 1.1em;
    }
  }

  .notes {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    font-style: italic;
    color: #7f8c8d;
  }
`;

const SearchContainer = styled.div`
  margin: 20px auto;
  max-width: 600px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  font-size: 1.1em;
  border: none;
  border-radius: 25px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 2px 20px rgba(0,0,0,0.2);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #999;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 1.1em;
  background: white;
  border-radius: 8px;
  margin: 15px 0;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
`;

const NavItem = styled.div`
  padding: 15px 30px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#333' : 'white'};
  font-weight: 500;
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, ${props => props.active ? '0.9' : '0.3'});
  }
`;

const SectionContainer = styled.div`
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.5s ease forwards;
  
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const BookmarkCard = styled(CustomerCard)`
  h2 {
    color: #2980b9;
  }
  
  .category {
    background: #e8f4f8;
    padding: 5px 10px;
    border-radius: 15px;
    display: inline-block;
    font-size: 0.9em;
    color: #2980b9;
  }
`;

const GlobalSearchContainer = styled(SearchContainer)`
  position: sticky;
  top: 20px;
  z-index: 100;
  margin: 0 auto 30px auto;
  
  &:before {
    content: '🔍';
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2em;
  }
`;

const GlobalSearchInput = styled(SearchInput)`
  padding-left: 50px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  
  &:focus {
    background: white;
  }
`;

const ResultsCount = styled.div`
  color: white;
  text-align: center;
  margin: 10px 0;
  font-size: 0.9em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const NoteCard = styled.div`
  border-left: 4px solid ${props => 
    props.priority === 'high' ? '#ff4757' : 
    props.priority === 'medium' ? '#ffa502' : '#2ed573'};
  
  textarea {
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 10px;
    margin-top: 10px;
    font-size: 1em;
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
    
    &:focus {
      outline: none;
      border-color: #2980b9;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
  }
`;

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  background: ${props => props.primary ? '#2980b9' : '#e0e0e0'};
  color: ${props => props.primary ? 'white' : '#333'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
`;

const AddNoteButton = styled(Button)`
  position: sticky;
  top: 35vh;
  height: fit-content;
  padding: 15px 25px;
  border-radius: 30px;
  background: #2980b9;
  color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  font-size: 1.2em;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.4;
  letter-spacing: 0.5px;
  font-weight: 500;

  span {
    display: flex;
    align-items: center;
    
    &:before {
      content: '+';
      margin-right: 8px;
      font-size: 1.4em;
      font-weight: 400;
      line-height: 1;
    }
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    background: #3498db;
  }
`;

const NoteFormCard = styled(NoteCard)`
  padding: 20px;
  margin-top: 20px;
`;

const NoteForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content, priority });
    setTitle('');
    setContent('');
    setPriority('medium');
  };

  return (
    <NoteFormCard>
      <input
        type="text"
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid #eee',
          borderRadius: '4px',
          fontSize: '1.1em'
        }}
      />
      <textarea
        placeholder="Note content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid #eee',
          borderRadius: '4px',
          minHeight: '100px',
          fontSize: '1em',
          fontFamily: 'inherit'
        }}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid #eee',
          borderRadius: '4px',
          fontSize: '1em'
        }}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <div className="actions">
        <Button onClick={onCancel}>Cancel</Button>
        <Button primary onClick={handleSubmit}>Save</Button>
      </div>
    </NoteFormCard>
  );
};

const NotesContainer = styled(SectionContainer)`
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 30px;
`;

const NotesContent = styled.div`
  width: 100%;
`;

const PhoneContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  backdrop-filter: blur(5px);
  z-index: 1000;
`;

const PhoneIcon = styled.div`
  font-size: 1.5em;
  animation: ${bounce} 2s infinite;
  cursor: pointer;
`;

const PhoneNumber = styled.div`
  font-size: 1em;
  color: #333;
  font-weight: 500;
  
  span {
    color: #666;
    font-size: 0.9em;
    display: block;
  }
`;

const OpenShiftCard = styled(CustomerCard)`
  h2 {
    color: #cc0000;
  }
  
  .status {
    background: #e8f4f8;
    padding: 5px 10px;
    border-radius: 15px;
    display: inline-block;
    font-size: 0.9em;
    color: #cc0000;
  }
`;

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    setCustomers(customersData);
    setBookmarks(bookmarksData);
    setNotes(notesData);
  }, []);

  const handleAddNote = () => {
    setShowNoteForm(true);
  };

  const handleSaveNewNote = (noteData) => {
    const newNote = {
      id: notes.length + 1,
      ...noteData,
      date: new Date().toISOString().split('T')[0]
    };
    setNotes([newNote, ...notes]);
    setShowNoteForm(false);
  };

  const handleSaveNote = (id, content) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
    setEditingNote(null);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.city.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm) ||
      customer.crp.toLowerCase().includes(searchLower)
    );
  });

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const searchLower = searchTerm.toLowerCase();
    return (
      bookmark.title.toLowerCase().includes(searchLower) ||
      bookmark.category.toLowerCase().includes(searchLower) ||
      bookmark.url.toLowerCase().includes(searchLower)
    );
  });

  const getTotalResults = () => {
    return filteredCustomers.length + filteredBookmarks.length;
  };

  const renderSection = () => {
    if (searchTerm) {
      return (
        <SectionContainer>
          {filteredCustomers.length > 0 && (
            <>
              <h2 style={{ color: 'white', marginTop: '20px' }}>Found Customers</h2>
              {filteredCustomers.map((customer) => (
                <CustomerCard key={customer.id}>
                  <h2>{customer.name}</h2>
                  <p>Email: {customer.email}</p>
                  <p>Phone: {customer.phone}</p>
                  <p>City: {customer.city}</p>
                </CustomerCard>
              ))}
            </>
          )}
          
          {filteredBookmarks.length > 0 && (
            <>
              <h2 style={{ color: 'white', marginTop: '20px' }}>Found Bookmarks</h2>
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id}>
                  <h2>{bookmark.title}</h2>
                  <p><a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a></p>
                  <p className="category">{bookmark.category}</p>
                  <p>Date: {bookmark.date}</p>
                </BookmarkCard>
              ))}
            </>
          )}
          
          {getTotalResults() === 0 && (
            <NoResults>
              No results found matching your search
            </NoResults>
          )}
        </SectionContainer>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <SectionContainer>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div onClick={() => setActiveSection('customers')} style={{ cursor: 'pointer' }}>
                <CustomerCard>
                  <h2>Customers</h2>
                  <p>Customer and contact management</p>
                  <p>Count: {customers.length}</p>
                </CustomerCard>
              </div>
              <div onClick={() => setActiveSection('bookmarks')} style={{ cursor: 'pointer' }}>
                <CustomerCard>
                  <h2>Bookmarks</h2>
                  <p>Important links and notes</p>
                  <p>Count: {bookmarks.length}</p>
                </CustomerCard>
              </div>
            </div>
            <h2 style={{ 
              color: '#2c3e50', 
              marginBottom: '20px',
              padding: '10px 15px',
              borderLeft: '4px solid #3498db',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '0 8px 8px 0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>Important Announcements</h2>
            {notes.map((note) => (
              <NoteCard key={note.id} priority={note.priority}>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <p>Date: {note.date}</p>
              </NoteCard>
            ))}
          </SectionContainer>
        );

      case 'customers':
        return (
          <SectionContainer>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <CustomerCard key={customer.id}>
                  <h2>{customer.name}</h2>
                  <p>CRP: {customer.crp}</p>
                  <p>Email: {customer.email}</p>
                  <p>Phone: {customer.phone}</p>
                  <a 
                    href={customer.documentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="documentation"
                  >
                    📄 View Documentation
                  </a>
                  <div className="restart">
                    {customer.restart}
                  </div>
                  <div className="notes">
                    📝 {customer.notes}
                  </div>
                </CustomerCard>
              ))
            ) : (
              <NoResults>
                No customers found matching your search
              </NoResults>
            )}
          </SectionContainer>
        );

      case 'bookmarks':
        return (
          <SectionContainer>
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id}>
                <h2>{bookmark.title}</h2>
                <p><a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a></p>
                <p className="category">{bookmark.category}</p>
                <p>Date: {bookmark.date}</p>
              </BookmarkCard>
            ))}
          </SectionContainer>
        );

      case 'notes':
        return (
          <NotesContainer>
            <NotesContent>
              {showNoteForm && (
                <NoteForm
                  onSave={handleSaveNewNote}
                  onCancel={() => setShowNoteForm(false)}
                />
              )}
              {notes
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((note) => (
                  <NoteCard key={note.id} priority={note.priority}>
                    <h2>{note.title}</h2>
                    {editingNote === note.id ? (
                      <>
                        <textarea
                          defaultValue={note.content}
                          placeholder="Enter note content..."
                          autoFocus
                        />
                        <div className="actions">
                          <Button onClick={() => setEditingNote(null)}>Cancel</Button>
                          <Button 
                            primary
                            onClick={(e) => handleSaveNote(note.id, e.target.previousSibling.previousSibling.value)}
                          >
                            Save
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>{note.content}</p>
                        <p>Date: {note.date}</p>
                        <div className="actions">
                          <Button onClick={() => handleDeleteNote(note.id)}>Delete</Button>
                          <Button primary onClick={() => setEditingNote(note.id)}>Edit</Button>
                        </div>
                      </>
                    )}
                  </NoteCard>
                ))}
            </NotesContent>
            {!showNoteForm && (
              <AddNoteButton onClick={handleAddNote}>
                <span>Add Announcement</span>
              </AddNoteButton>
            )}
          </NotesContainer>
        );

      case 'openshift':
        return (
          <SectionContainer>
            <OpenShiftCard>
              <h2>Resources</h2>
              <p>Documentation and Support</p>
              <p><a href="https://docs.openshift.com" target="_blank" rel="noopener noreferrer">OpenShift Documentation</a></p>
              <p><a href="https://console.redhat.com" target="_blank" rel="noopener noreferrer">Red Hat Console</a></p>
              <p><a href="https://access.redhat.com" target="_blank" rel="noopener noreferrer">Red Hat Access Portal</a></p>
            </OpenShiftCard>
          </SectionContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      {activeSection === 'openshift' && (
        <PhoneContainer>
          <PhoneIcon>📞</PhoneIcon>
          <PhoneNumber>
            <span>OpenShift oncall</span>
            +420 597 175 677
          </PhoneNumber>
        </PhoneContainer>
      )}
      <Title>TEST</Title>
      <GlobalSearchContainer>
        <GlobalSearchInput
          type="text"
          placeholder="Global search across all sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <ResultsCount>
            Found {getTotalResults()} results
          </ResultsCount>
        )}
      </GlobalSearchContainer>
      <Navigation>
        <NavItem 
          active={activeSection === 'dashboard'} 
          onClick={() => setActiveSection('dashboard')}
        >
          Dashboard
        </NavItem>
        <NavItem 
          active={activeSection === 'customers'} 
          onClick={() => setActiveSection('customers')}
        >
          Customers
        </NavItem>
        <NavItem 
          active={activeSection === 'bookmarks'} 
          onClick={() => setActiveSection('bookmarks')}
        >
          Bookmarks
        </NavItem>
        <NavItem 
          active={activeSection === 'notes'} 
          onClick={() => setActiveSection('notes')}
        >
          Important Announcements
        </NavItem>
        <NavItem 
          active={activeSection === 'openshift'} 
          onClick={() => setActiveSection('openshift')}
        >
          OpenShift
        </NavItem>
      </Navigation>
      {renderSection()}
    </Container>
  );
};

export default App; 
