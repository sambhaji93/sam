pipeline {
  environment {
    image = "hsi-cms-backend"
    registry = "cms-registry.eversana.com/cms/$image"
    git_branch = 'master'
    image_tag = "latest"
    registry_with_image_tag = ""
  }
  agent any
  stages {
    stage('Preparation') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: "*/$git_branch"]], extensions: [], userRemoteConfigs: [[credentialsId: 'Gitlab_Auth_SSH_Key', url: 'git@bitbucket.org:triplefin/hsi-cms-backend.git']]])
        script {
            npm_package_version = sh (
                script: 'awk -F\'"\' \'/"version": ".+"/{ print $4; exit; }\' package.json',
                returnStdout: true
            ).trim()
            image_tag = "$npm_package_version"
        }
      }
    }
    stage('docker build/push/clean') {
      steps{
        script {
            registry_with_image_tag = "$registry:$image_tag"
            sh "docker build -t $registry_with_image_tag ."
            sh "docker push $registry_with_image_tag"
            sh "docker rmi \$(docker images ${registry} -a -q)"
            sh "docker container prune -f"
            sh "docker image prune -f"
        }
      }
    }
    stage ('k8s Deploy') {
        steps{
            script {
                sh "sed -e 's|DOCKER_IMAGE|$registry_with_image_tag|g' k8s/deployment.yml | kubectl apply -f -"
                sh "kubectl rollout restart -f k8s/deployment.yml"
                sh "kubectl apply -f k8s/service.yml -f k8s/hpa.yml"
            }
        }
    }
  }
}
