import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, 
        Breadcrumb, BreadcrumbItem, 
        Button, Label,  Modal, ModalHeader, 
        ModalBody, Form, FormFeedback
        } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

    function RenderCampsite({campsite}){
        return (
            <div className="col-md-5 m-1">
                <Card>
                    <CardImg top src={campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        )
    }

    function RenderComments({comments}){
        if (comments) {
            return(
            <div className = "col-md-5 m-1">
                <h4>Comments</h4>
                    
                    {comments.map(comment => {
                        return(<div className="p-2" key={comment.id}> {comment.text} <br/> --{comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</div>);
                    
                })}
                <CommentForm/>
            </div>
            );
        }
            
    }

    class CommentForm extends Component {

            constructor(props) {
                super(props);
        
                this.state = {
                    author: '',
                    isModalOpen: false,
                    touched: { author: false }
                };
                this.toggleModal = this.toggleModal.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
            }

            validate (author) {
                const errors = { author: '' };
                if (this.state.touched.author){
                    if (author.lenght < 2) {
                        errors.author = 'Your Name must be at least 2 characters in lenght.';    
                    } else if (author.lenght > 15) {
                        errors.author = 'Your name must be less than 15 characters in lenght.';
                    }
                }
                return errors;
            }

            handleBlur = (field) => () => {
                this.setState({
                    touched: {...this.state.touched, [field]: true}
                });
            }
        
            toggleModal() {
                this.setState({
                    isModalOpen: !this.state.isModalOpen
                });
            }

            handleSubmit(values){
                console.log("Currente state is: " + JSON.stringify(values));
                alert("Currente state is: " + JSON.stringify(values));
                this.toggleModal();
            }

        render() {
            const errors = this.validate(this.state.author);

            return (
                <React.Fragment>
                    <Button onClick={this.toggleModal} type="submit" color="btn btn-outline-secondary">
                        <i className="fa fa-pencil fa-lg" /> Submit Comment            
                    </Button>

                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={values =>this.handleSubmit(values)}>
                            <Form onSubmit={this.handleLogin}>
                                <div className="form-group">
                                    <Label htmlFor="rating">Rating</Label>
                                        <Control.select className="form-control" model=".rating" id="rating" name="rating" >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Control.select>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="author">Your Name</Label>
                                    <Control.text 
                                    className="form-control" 
                                    model=".author" id="author" 
                                    name="author" 
                                    invalid ={errors.author}
                                    onBlur={this.handleBlur("author")}
                                    innerRef={input => this.password = input}
                                    />
                                    <FormFeedback>{errors.author}</FormFeedback>
                                    <Errors
                                        model=".author"
                                        messages={{
                                            isRequired: 'Please provide an email address.'
                                        }}
                                    />
                                </div>
                                <div  className="form-group">
                                    <Label htmlFor="comment"> Comment </Label>
                                        <Control.textarea className="form-control" model=".comment" type="textarea" rows="5" name="comment" innerRef={input => this.remember = input}
                                        />
                                </div>
                                <Button type ="submit" value="submit" color="primary">Submit</Button>
                            </Form>
                        </LocalForm>
                    </ModalBody>
                    </Modal>
                </React.Fragment>
            )
        }
    }

    function CampsiteInfo(props){
        if (props.campsite){
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                <BreadcrumbItem active> {props.campsite.name} </BreadcrumbItem>
                            </Breadcrumb>
                            <h2>{props.campsite.name}</h2>
                            <hr />
                        </div>
                    </div>
                    <div className = "row">
                        <RenderCampsite campsite={props.campsite}/>
                        <RenderComments comments={props.comments}/>
                    </div>
                </div>
            );
        }
            return <div/>;
    }

export default CampsiteInfo