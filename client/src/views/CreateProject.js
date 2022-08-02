import React from "react";
import { 
  Container, 
  Row, 
  Col
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";

const CreateProject = () => {

  return (
  <Container fluid className="main-content-container px-4 pb-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Project" subtitle="Create" className="text-sm-left" />
    </Row>

    <Row>
      {/* Editor */}
      <Col md="12">
        <Editor />
      </Col>
    </Row>
   
  </Container>
)};

export default CreateProject;
