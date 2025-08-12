pipeline {
    agent any
    
    environment {
        DOCKER_HUB_REGISTRY = 'docker.io'
        DOCKER_HUB_REPO = 'yourusername/frontend-service'  // Replace with your Docker Hub username
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
        SONAR_PROJECT_KEY = 'frontend-service'
        SONAR_PROJECT_NAME = 'Frontend Service'
    }
    
    tools {
        nodejs 'NodeJS-18'  // Configure this in Jenkins Global Tools
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Build Stage') {
            steps {
                echo 'Installing dependencies and building application...'
                sh 'npm --version'
                sh 'node --version'
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Test Stage') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        echo 'Running unit tests...'
                        sh 'npm test'
                    }
                    post {
                        always {
                            // Publish test results
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Test Coverage Report'
                            ])
                        }
                    }
                }
                
                stage('Lint') {
                    steps {
                        echo 'Running ESLint...'
                        sh 'npm run lint'
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    echo 'Running SonarQube analysis...'
                    withSonarQubeEnv('SonarQube') {  // Configure this in Jenkins
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                              -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                              -Dsonar.sources=src \
                              -Dsonar.tests=src \
                              -Dsonar.test.inclusions="**/*.test.js,**/*.spec.js" \
                              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                              -Dsonar.exclusions="node_modules/**,build/**,public/**"
                        '''
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Container Build') {
            steps {
                script {
                    echo 'Building Docker image...'
                    def dockerImage = docker.build("${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG}")
                    
                    // Also tag as latest for current branch
                    if (env.BRANCH_NAME == 'main') {
                        dockerImage.tag('latest')
                        dockerImage.tag('prod-latest')
                    } else if (env.BRANCH_NAME == 'develop') {
                        dockerImage.tag('dev-latest')
                    } else if (env.BRANCH_NAME.startsWith('release/')) {
                        dockerImage.tag('staging-latest')
                    }
                }
            }
        }
        
        stage('Container Security Scan') {
            steps {
                script {
                    echo 'Scanning Docker image for vulnerabilities...'
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                        -v \$(pwd):/tmp/scan \\
                        aquasec/trivy image --exit-code 0 --no-progress \\
                        --format table --output /tmp/scan/trivy-report.txt \\
                        ${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG}
                    """
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'trivy-report.txt', allowEmptyArchive: true
                }
            }
        }
        
        stage('Container Push') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop' 
                    branch 'release/*'
                }
            }
            steps {
                script {
                    echo 'Pushing Docker image to registry...'
                    withDockerRegistry([credentialsId: 'docker-hub-credentials', url: 'https://index.docker.io/v1/']) {
                        def dockerImage = docker.image("${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG}")
                        dockerImage.push()
                        dockerImage.push("git-${env.GIT_COMMIT.take(8)}")
                        
                        if (env.BRANCH_NAME == 'main') {
                            dockerImage.push('latest')
                            dockerImage.push('prod-latest')
                        } else if (env.BRANCH_NAME == 'develop') {
                            dockerImage.push('dev-latest')
                        } else if (env.BRANCH_NAME.startsWith('release/')) {
                            dockerImage.push('staging-latest')
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            parallel {
                stage('Deploy to Dev') {
                    when {
                        branch 'develop'
                    }
                    steps {
                        echo 'Deploying to Development environment...'
                        script {
                            // This will be implemented in Phase 5 with Kubernetes
                            sh """
                                echo 'Would deploy ${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG} to DEV environment'
                                echo 'Image tag: dev-latest'
                            """
                        }
                    }
                }
                
                stage('Deploy to Staging') {
                    when {
                        branch 'release/*'
                    }
                    steps {
                        echo 'Deploying to Staging environment...'
                        script {
                            sh """
                                echo 'Would deploy ${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG} to STAGING environment'
                                echo 'Image tag: staging-latest'
                            """
                        }
                    }
                }
                
                stage('Deploy to Production') {
                    when {
                        allOf {
                            branch 'main'
                            expression { 
                                return params.DEPLOY_TO_PRODUCTION == true 
                            }
                        }
                    }
                    steps {
                        echo 'Deploying to Production environment...'
                        script {
                            sh """
                                echo 'Would deploy ${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG} to PRODUCTION environment'
                                echo 'Image tag: prod-latest'
                            """
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        
        success {
            echo 'Pipeline completed successfully!'
            script {
                if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'develop') {
                    emailext (
                        subject: "✅ Frontend Service Pipeline Success - ${env.BRANCH_NAME}",
                        body: """
                            <h3>Pipeline Completed Successfully!</h3>
                            <p><strong>Branch:</strong> ${env.BRANCH_NAME}</p>
                            <p><strong>Build:</strong> ${env.BUILD_NUMBER}</p>
                            <p><strong>Image:</strong> ${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG}</p>
                            <p><strong>Commit:</strong> ${env.GIT_COMMIT}</p>
                        """,
                        to: "${env.CHANGE_AUTHOR_EMAIL}",
                        mimeType: 'text/html'
                    )
                }
            }
        }
        
        failure {
            echo 'Pipeline failed!'
            emailext (
                subject: "❌ Frontend Service Pipeline Failed - ${env.BRANCH_NAME}",
                body: """
                    <h3>Pipeline Failed!</h3>
                    <p><strong>Branch:</strong> ${env.BRANCH_NAME}</p>
                    <p><strong>Build:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Stage:</strong> ${env.STAGE_NAME}</p>
                    <p><strong>Commit:</strong> ${env.GIT_COMMIT}</p>
                    <p>Please check the build logs for more details.</p>
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL}",
                mimeType: 'text/html'
            )
        }
    }
}

// Parameters for manual triggers
properties([
    parameters([
        booleanParam(
            defaultValue: false,
            description: 'Deploy to Production environment (only for main branch)',
            name: 'DEPLOY_TO_PRODUCTION'
        )
    ])
])