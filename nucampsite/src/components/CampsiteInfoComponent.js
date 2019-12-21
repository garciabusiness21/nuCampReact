import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, 
        Breadcrumb, BreadcrumbItem, 
        Button, Label,  Modal, ModalHeader, 
        ModalBody, Form, FormFeedback
        } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = val => val && val.lenght;
const maxLenght = len => val => !val || (val.lenght <= len);
const minlenght = len => val => val && (val.lenght >= len);

    function RenderCampsite({campsite}){
        return (
            <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
        )
    }

    function RenderComments({comments, postComment, campsiteId}) {
        if (comments) {
            return(
            <div className = "col-md-5 m-1">
                <h4>Comments</h4>
                <Stagger in>
                    {comments.map(comment => {
                        return (
                            <Fade in key={comment.id}>
                                <div>
                                    <p>{comment.text}<br />
                                        -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                    </p>
                                </div>
                            </Fade>
                        );
                    })}
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
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
                    if (author.length < 2) {
                        errors.author = 'Your Name must be at least 2 characters in lenght.';    
                    } else if (author.length > 15) {
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

            handleSubmit(values) {
                this.toggleModal();
                this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
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
                                        validators= {{
                                            required,
                                            minlenght: minlenght(2),
                                            maxLenght: maxLenght(15)
                                        }}
                                    />
                                    <FormFeedback>{errors.author}</FormFeedback>
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minlenght: 'Must be at least 2 characters',
                                            maxLenght: '15 character limit'
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
        if (props.isLoading) {
            return (
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        if (props.errMess) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h4>{props.errMess}</h4>
                        </div>
                    </div>
                </div>
            );
        }
        if (props.campsite) {
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
                        <RenderComments 
                            comments={props.comments}
                            campsiteId={props.campsite.id}
                            postComment={props.postComment}
                        />
                    </div>
                </div>
            );
        }
            return <div/>;
    }

export default CampsiteInfo